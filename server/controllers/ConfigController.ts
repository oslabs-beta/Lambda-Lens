import { Request, Response, NextFunction, RequestHandler } from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { AwsClientService } from '../services/AwsClientService';
import crypto from 'crypto';
import UserConfig, { IUserConfig } from '../models/userConfig'; 

interface ConfigParams {
  awsAccessKeyID: string;
  awsSecretAccessKey: string;
  awsRegion: string;
}

class ConfigValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigValidationError';
  }
}

// Encryption constants
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // For AES-GCM
const AUTH_TAG_LENGTH = 16; // For AES-GCM

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
  }

  private encrypt(text: string): string {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey || encryptionKey.length !== 64) { 
      throw new Error('ENCRYPTION_KEY environment variable is missing or invalid (must be a 64-character hex string).');
    }
    const key = Buffer.from(encryptionKey, 'hex');
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }


  public saveConfiguration: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.uid) {
         return next({
           log: 'Error in ConfigController.saveConfiguration: User ID not found on request. Middleware might be missing or failed.',
           status: 401, 
           message: { err: 'Authentication required.' },
         });
      }
      const userId = req.user.uid;

      const config: ConfigParams = req.body;
      this.validateConfig(config);

      const encryptedSecretKey = this.encrypt(config.awsSecretAccessKey);

      await UserConfig.findOneAndUpdate(
        { userId: userId },
        {
          userId: userId,
          awsAccessKeyId: config.awsAccessKeyID,
          awsSecretAccessKey: encryptedSecretKey, 
          awsRegion: config.awsRegion,
        },
        { upsert: true, new: true }
      );

      res.locals.saved = 'AWS configuration successfully saved for user.';
      return next();
    } catch (error) {
       console.error("Error during saveConfiguration:", error);
       const errorMessage = error instanceof Error ? error.message : 'Error saving configuration';
       return next({
         log: `Error in ConfigController.saveConfiguration: ${errorMessage}`,
         status: error instanceof ConfigValidationError ? 400 : 500,
         message: { err: errorMessage },
       });
    }
  };

  public connectDatabase: RequestHandler = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const readyState = mongoose.connection.readyState;
      // 0 = disconnected; 1 = connected; 2 = connecting; 3 = disconnecting
      if (readyState === 1) {
        res.status(200).json({ message: "Database connection is healthy" });
      } else {
        throw new Error(`Database connection state is: ${readyState}`);
      }
    } catch (error) {
      return next({
        log: `Error in ConfigController.connectDatabase check: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 503, 
        message: { err: 'Database connection is not healthy' },
      });
    }
  };

  // --- Decryption Helper ---
  private decrypt(encryptedText: string): string {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey || encryptionKey.length !== 64) { 
      throw new Error('ENCRYPTION_KEY environment variable is missing or invalid (must be a 64-character hex string).');
    }
    const key = Buffer.from(encryptionKey, 'hex');
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted format. Expected iv:authTag:encryptedData.');
    }
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encryptedData = parts[2];

    if (iv.length !== IV_LENGTH) {
        throw new Error(`Invalid IV length. Expected ${IV_LENGTH}, got ${iv.length}.`);
    }
    if (authTag.length !== AUTH_TAG_LENGTH) {
        throw new Error(`Invalid authTag length. Expected ${AUTH_TAG_LENGTH}, got ${authTag.length}.`);
    }

    try {
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag); 

        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8'); 
        return decrypted;
    } catch (error) {
        console.error("Decryption failed:", error);
        throw new Error(`Decryption failed. The key may be incorrect or the data corrupted. ${error instanceof Error ? error.message : ''}`);
    }
  }

  // --- Helper to get Decrypted User Config ---
  public async getDecryptedUserConfig(userId: string): Promise<IUserConfig | null> {
    if (!userId) {
      console.error("getDecryptedUserConfig called without userId");
      return null;
    }
    try {
      const userConfig = await UserConfig.findOne({ userId: userId }).lean(); 

      if (!userConfig) {
        return null; 
      }

      // Decrypt the secret key
      const decryptedSecretKey = this.decrypt(userConfig.awsSecretAccessKey);

      return {
        ...userConfig,
        awsSecretAccessKey: decryptedSecretKey, 
      };

    } catch (error) {
      console.error(`Error fetching or decrypting config for user ${userId}:`, error);
      if (error instanceof Error && error.message.includes('Decryption failed')) {
           throw error; 
      }
      return null; 
    }
  }
}

export const configController = ConfigController.getInstance();