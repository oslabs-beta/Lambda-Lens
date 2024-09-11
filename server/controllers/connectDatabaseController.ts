import { Request, Response, NextFunction, RequestHandler } from 'express';
// import connectToDatabase from '../models/dbConnection';
import mongoose from 'mongoose';
import dotenv from 'dotenv';


interface connectDatabaseController {
    connectDatabase: RequestHandler;
  }
  
  export const connectDatabaseController: connectDatabaseController = {
    connectDatabase: async (
      _req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
        try{
            dotenv.config(); 
            // await mongoose.connection.close();
            // mongoose.disconnect();
            console.log('MONGODB_URI from .env is: ', process.env.MONGODB_URI);
            await mongoose.connect(process.env.MONGODB_URI as string);
            console.log('Connected to MongoDB');
            return next();
        } catch (err) {
            return next({
                log: 'Error in connectDatabaseController',
                status: 500,
                message: { err: err+'Error occurred when connecting to MongoDB' },
              });
        }
    }
}
