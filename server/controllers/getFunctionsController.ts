import { LambdaClient, ListFunctionsCommand } from '@aws-sdk/client-lambda';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { awsconfig } from '../configs/awsconfig';

interface GetFunctionsController {
  listFunctionData: RequestHandler;
}

// Function to list all Lambda functions
export const getFunctionsController: GetFunctionsController = {
  
  listFunctionData: async (
    _req: Request, 
    res: Response, 
    next: NextFunction): 
    Promise<void> => {
    const lambdaClient = new LambdaClient(awsconfig);

    const command = new ListFunctionsCommand({});
    try {
        const data = await lambdaClient.send(command);
        const funcObjectArray:any = await data.Functions;   //probably not best practice to use any but each object is very large
        // console.log('funcObjectArray: ', funcObjectArray);

        //gather function names into array
        res.locals.functionsList = [];
        for (const func of funcObjectArray){
          res.locals.functionsList.push(func.FunctionName);
        }
        // console.log('functionsList: ', res.locals.functionsList);
    
        return next();
    } catch (err) {
        //need to insert global error handler with return next({error})
        console.error(err);
    }
    }
};
