import { Request, Response, NextFunction, RequestHandler } from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

interface EnvController {
  saveSecrets: RequestHandler;
}

export const envController: EnvController = {
  //save secrets (credentials, region, and MongoDB URI) into .env
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
          log: `Error in envController.saveSecrets`, //more semantic (fields missing)
          status: 500,
          message: { err: 'One or more fields missing.' }, //more semantic (fields missing)
        });
      }
      //else if at least one field is missing --> return an error;
      // console.log('Made it to the try block');
      fs.writeFileSync('./.env', writeToENV);
      res.locals.saved = 'Secrets successfuly saved';
      console.log('Saved to .env');
      dotenv.config();

      // should close database connection so it can be reconnected when user presses "connect to db" button
      // await mongoose.connection.close();
      // mongoose.disconnect();
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
