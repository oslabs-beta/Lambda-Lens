import { Request, Response, NextFunction } from 'express';
import visData from '../models/visDataModel';
import { getAwsConfig } from '../configs/awsconfig';


interface Log {
  Date: string;
  Time: string;
  FunctionName: string;
  BilledDuration: string;
  InitDuration?: string;
  MaxMemUsed: string;
}

interface RawData {
  functionName: string;
  logs: Log[];
}

export const databaseController = {
  processData: async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const awsconfig = getAwsConfig();
      const { region } = awsconfig;
      
      const rawData: RawData[] = res.locals.allData;

      for (let func of rawData) {
        let totalStarts = func.logs.length + 1;
        let billed = 0;
        let cold = 0;

        for (const log of func.logs) {
          billed += parseInt(log.BilledDuration, 10);
          if (log.InitDuration) cold++;
        }

        const percentCold = totalStarts > 0 ? (cold / totalStarts) * 100 : 0;

        await visData.findOneAndUpdate(
          { functionName: func.functionName, region: region },
          {
            region: region,
            functionName: func.functionName,
            avgBilledDur: billed,
            numColdStarts: cold,
            percentColdStarts: percentCold.toFixed(2),
          },
          {
            upsert: true,
            returnNewDocument: true,
          }
        );
      }
      return next();
    } catch (err) {
      next({
        log: 'Error in databaseController.processData',
        status: 500,
        message: { err: 'Error occurred when finding/updating database.' },
      });
    }
  },

  getProccessedData: async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const awsconfig = getAwsConfig();
      const { region } = awsconfig;

      res.locals.data = await visData.find({ region });
      return next();
    } catch (err) {
      next({
        log: 'Error in databaseController.getProcessedData',
        status: 500,
        message: { err: 'Error occurred when finding from database' },
      });
    }
  },
};
