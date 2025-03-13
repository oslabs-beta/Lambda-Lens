import { Request, Response, NextFunction, RequestHandler } from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { AwsClientService } from '../services/AwsClientService';

interface ConfigParams {
  awsAccessKeyID: string;
  awsSecretAccessKey: string;
  awsRegion: string;
  mongoURI: string;
}

class ConfigValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigValidationError';
  }
}

class ConfigController {
  private static instance: ConfigController;
  private awsClientService: AwsClientService;

  private constructor() {
    this.awsClientService = AwsClientService.getInstance();
  }

  public static getInstance(): ConfigController {
    if (!ConfigController.instance) {
      ConfigController.instance = new ConfigController();
    }
    return ConfigController.instance;
  }

  private validateConfig(config: ConfigParams): void {
    if (!config.awsAccessKeyID) throw new ConfigValidationError('AWS Access Key ID is required');
    if (!config.awsSecretAccessKey) throw new ConfigValidationError('AWS Secret Access Key is required');
    if (!config.awsRegion) throw new ConfigValidationError('AWS Region is required');
    if (!config.mongoURI) throw new ConfigValidationError('MongoDB URI is required');
  }

  private async saveEnvironmentVariables(config: ConfigParams): Promise<void> {
    const envContent =
      `AWS_ACCESS_KEY_ID=${config.awsAccessKeyID}\n` +
      `AWS_SECRET_ACCESS_KEY=${config.awsSecretAccessKey}\n` +
      `AWS_REGION=${config.awsRegion}\n` +
      `MONGODB_URI=${config.mongoURI}\n`;

    await fs.promises.writeFile('./.env', envContent);
    dotenv.config();
  }

  private async updateAwsConfig(config: ConfigParams): Promise<void> {
    this.awsClientService.updateConfig({
      credentials: {
        accessKeyId: config.awsAccessKeyID,
        secretAccessKey: config.awsSecretAccessKey,
      },
      region: config.awsRegion,
    });
  }

  private async connectToDatabase(mongoURI: string): Promise<void> {
    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
      }
      await mongoose.connect(mongoURI);
    } catch (error) {
      throw new Error(`Failed to connect to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public saveConfiguration: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const config: ConfigParams = req.body;
      this.validateConfig(config);
      
      await this.saveEnvironmentVariables(config);
      await this.updateAwsConfig(config);
      
      res.locals.saved = 'Configuration successfully saved';
      return next();
    } catch (error) {
      return next({
        log: `Error in ConfigController.saveConfiguration: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 400,
        message: { err: error instanceof ConfigValidationError ? error.message : 'Error saving configuration' },
      });
    }
  };

  public connectDatabase: RequestHandler = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const mongoURI = process.env.MONGODB_URI;
      if (!mongoURI) {
        throw new ConfigValidationError('MongoDB URI is not configured');
      }

      await this.connectToDatabase(mongoURI);
      console.log('Connected to MongoDB');
      return next();
    } catch (error) {
      return next({
        log: `Error in ConfigController.connectDatabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 500,
        message: { err: error instanceof ConfigValidationError ? error.message : 'Failed to connect to database' },
      });
    }
  };
}

export const configController = ConfigController.getInstance();