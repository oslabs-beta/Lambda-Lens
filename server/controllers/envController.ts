import { Request, Response, NextFunction, RequestHandler } from 'express'; 
import fs from 'fs';

interface EnvController {
    saveSecrets: RequestHandler;
}

export const envController: EnvController = {
    //save secrets (credentials, region, and MongoDB URI) into .env
    saveSecrets: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        console.log('Made it to the controller');

        const { awsAccessKeyID, awsSecretAccessKey, awsRegion, mongoURI }:
        { awsAccessKeyID: string; awsSecretAccessKey: string; awsRegion: string; mongoURI: string } = req.body;
        console.log('The req body is:', req.body);
        //Format .env:
        const writeToENV =
        `AWS_ACCESS_KEY_ID=${awsAccessKeyID}\n` +
        `AWS_SECRET_ACCESS_KEY=${awsSecretAccessKey}\n`+
        `AWS_REGION=${awsRegion}\n`+
        `MONGODB_URI=${mongoURI}\n`;

        try{
            console.log('Made it to the try block');
            fs.writeFileSync('./.env', writeToENV);
            res.locals.saved = 'Secrets successfuly saved';
            return next();
        }catch(err){
            return next({
                log: `${err}: Error caught in envController.saveSecrets middleware function.`,
                status: 500,
                message: {err: 'Error saving Access key id, secret access key, and region.'}
            });
        }
    }
};
