import { Request, Response, NextFunction, RequestHandler } from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { AwsClientService } from '../services/AwsClientService';

interface EnvController {
  saveSecrets: RequestHandler;
}

export const envController: EnvController = {
  saveSecrets: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const {
      awsAccessKeyID,
      awsSecretAccessKey,
      awsRegion,
      mongoURI,
    }: {
      awsAccessKeyID: string;
      awsSecretAccessKey: string;
      awsRegion: string;
      mongoURI: string;
    } = req.body;

    //Format .env:
    const writeToENV =
      `AWS_ACCESS_KEY_ID=${awsAccessKeyID}\n` +
      `AWS_SECRET_ACCESS_KEY=${awsSecretAccessKey}\n` +
      `AWS_REGION=${awsRegion}\n` +
      `MONGODB_URI=${mongoURI}\n`;

    try {
      //if everything exists in the req body --> write env file
      if (
        !req.body.awsAccessKeyID ||
        !req.body.awsRegion ||
        !req.body.awsSecretAccessKey ||
        !req.body.mongoURI
      ) {
        return next({
          log: `Error in envController.saveSecrets`,
          status: 500,
          message: { err: 'One or more fields missing.' },
        });
      }

      fs.writeFileSync('./.env', writeToENV);
      dotenv.config();

      // Update AWS client configuration with new credentials
      const awsClientService = AwsClientService.getInstance();
      awsClientService.updateConfig({
        credentials: {
          accessKeyId: awsAccessKeyID,
          secretAccessKey: awsSecretAccessKey,
        },
        region: awsRegion,
      });

      res.locals.saved = 'Secrets successfully saved';
      console.log('Saved to .env and updated AWS configuration');

      return next();
    } catch (err) {
      return next({
        log: `${err}: Error caught in envController.saveSecrets middleware function.`,
        status: 500,
        message: {
          err: 'Error saving AWS Access Key ID, AWS Secret Access Key, AWS region, and MongoURI.',
        },
      });
    }
  },
};
