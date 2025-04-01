import { Request, Response, NextFunction, RequestHandler } from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { AwsClientService } from '../services/AwsClientService';
import crypto from 'crypto'; // Use crypto module
import UserConfig from '../models/userConfig'; // We'll create this model next

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
    if (!encryptionKey || encryptionKey.length !== 64) { // Ensure key is hex 32 bytes
      throw new Error('ENCRYPTION_KEY environment variable is missing or invalid (must be a 64-character hex string).');
    }
    const key = Buffer.from(encryptionKey, 'hex');
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    // Combine IV, authTag, and encrypted data for storage
    // Format: iv:authTag:encryptedData (all hex encoded)
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

      // Encrypt the secret key before saving
      const encryptedSecretKey = this.encrypt(config.awsSecretAccessKey);

      await UserConfig.findOneAndUpdate(
        { userId: userId },
        {
          userId: userId,
          awsAccessKeyId: config.awsAccessKeyID,
          awsSecretAccessKey: encryptedSecretKey, // Store the encrypted version
          awsRegion: config.awsRegion,
        },
        { upsert: true, new: true }
      );

      res.locals.saved = 'AWS configuration successfully saved for user.';
      return next();
    } catch (error) {
       // Log the specific error for debugging
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
      const mongoURI = process.env.MONGODB_URI;
      if (!mongoURI) {
        throw new ConfigValidationError('MongoDB URI is not configured on the server');
      }
      // Check connection status without reconnecting unnecessarily
      if (mongoose.connection.readyState !== 1) {
         await this.connectToDatabase(mongoURI);
         console.log('Connected to MongoDB');
      } else {
         console.log('Already connected to MongoDB');
      }
      res.status(200).json({ message: "Database connection is healthy" });
    } catch (error) {
      return next({
        log: `Error in ConfigController.connectDatabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 500,
        message: { err: error instanceof ConfigValidationError ? error.message : 'Failed to connect to database' },
      });
    }
  };

  private async connectToDatabase(mongoURI: string): Promise<void> {
     try {
       if (mongoose.connection.readyState !== 1) {
         await mongoose.connect(mongoURI);
       }
     } catch (error) {
       throw new Error(`Failed to connect to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`);
     }
  }

  // --- Decryption Helper (will be needed later) ---
  // private decrypt(encryptedText: string): string {
  //   const encryptionKey = process.env.ENCRYPTION_KEY;
  //   if (!encryptionKey || encryptionKey.length !== 64) {
  //     throw new Error('ENCRYPTION_KEY environment variable is missing or invalid.');
  //   }
  //   const key = Buffer.from(encryptionKey, 'hex');
  //   const parts = encryptedText.split(':');
  //   if (parts.length !== 3) {
  //     throw new Error('Invalid encrypted format.');
  //   }
  //   const iv = Buffer.from(parts[0], 'hex');
  //   const authTag = Buffer.from(parts[1], 'hex');
  //   const encryptedData = parts[2];

  //   if (iv.length !== IV_LENGTH || authTag.length !== AUTH_TAG_LENGTH) {
  //      throw new Error('Invalid IV or authTag length.');
  //   }

  //   const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  //   decipher.setAuthTag(authTag);

  //   let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  //   decrypted += decipher.final('utf8');
  //   return decrypted;
  // }
  // --- End Decryption Helper ---
}

export const configController = ConfigController.getInstance();