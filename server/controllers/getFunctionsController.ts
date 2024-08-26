import { LambdaClient, ListFunctionsCommand } from '@aws-sdk/client-lambda';
import dotenv from 'dotenv';
import path from 'path';
// import { Config } from '../../types.ts' 

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env')});

//I still need to put this Config interface into a types.ts and import it, also need to not use ?
interface Config {
    credentials: {
      accessKeyId?: string;
      secretAccessKey?: string;
    };
    region?: string;
  };

const config: Config = {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
};

  

const lambdaClient = new LambdaClient(config);

// Function to list all Lambda functions
export const getFunctions = async () => {
    const command = new ListFunctionsCommand({});
    try {
      //send the ListFunctions command to the Lambda Client
      const data = await lambdaClient.send(command);
    //   console.log(data);

      //funcObjectArray contains keys we can use such as 
      //FunctionName, MemorySize, Timeout, and CodeSize
      const funcObjectArray: any = await data.Functions;
      console.log(funcObjectArray);

      //this controller will return an array of objects with more information than we potentially need
      //in order to get ONLY a functionsList array, use the following logic
      let functionsList = [];
      for (const func of funcObjectArray){
        functionsList.push(func.FunctionName);
      }
      console.log(functionsList);

      return funcObjectArray;
    } catch (err) {
      console.error(err);
    }
};

//in order to run this file, make your directory the "controllers" folder (i.e. cd server && cd controllers)
//then input the command ts-node getFunctionsController.ts
getFunctions();