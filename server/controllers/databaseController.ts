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

interface BatchProcessResult {
  functionName: string;
  avgBilledDur: number;
  numColdStarts: number;
  percentColdStarts: number;
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
      const BATCH_SIZE = 5;

      // Process data in batches
      const processBatch = async (batch: RawData[]): Promise<BatchProcessResult[]> => {
        return batch.map(func => {
          let totalStarts = func.logs.length + 1;
          let billed = 0;
          let cold = 0;

          for (const log of func.logs) {
            billed += parseInt(log.BilledDuration, 10);
            if (log.InitDuration) cold++;
          }

          const percentCold = totalStarts > 0 ? (cold / totalStarts) * 100 : 0;

          return {
            functionName: func.functionName,
            avgBilledDur: billed,
            numColdStarts: cold,
            percentColdStarts: percentCold
          };
        });
      };

      // Save batch to database
      const saveBatch = async (results: BatchProcessResult[]): Promise<void> => {
        await Promise.all(
          results.map(result =>
            visData.findOneAndUpdate(
              { functionName: result.functionName, region: region },
              {
                region: region,
                functionName: result.functionName,
                avgBilledDur: result.avgBilledDur,
                numColdStarts: result.numColdStarts,
                percentColdStarts: result.percentColdStarts.toFixed(2)
              },
              {
                upsert: true,
                returnNewDocument: true
              }
            )
          )
        );
      };

      // Process data in batches
      for (let i = 0; i < rawData.length; i += BATCH_SIZE) {
        const batch = rawData.slice(i, i + BATCH_SIZE);
        const processedBatch = await processBatch(batch);
        await saveBatch(processedBatch);
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
