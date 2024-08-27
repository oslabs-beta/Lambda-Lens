import { Request, Response, NextFunction } from 'express';
import visData from '../models/visDataModel';

interface Log {
  Date: string;
  Time: string;
  Duration: string;
  BilledDuration: string;
  InitDuration: string;
  MaxMemUsed: string;
}

interface RawData {
  functionName: string;
  logs: Log[];
}

export const databaseController = {
  processData: async (
    res: Response,
    _req: Request,
    next: NextFunction
  ): Promise<void> => {
    try {
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

        await visData.create({
          functionName: func.functionName,
          avgBilledDur: billed,
          numColdStarts: cold,
          percentColdStarts: percentCold.toFixed(2),
        });
      }
      return next();
    } catch (err) {
      next({
        message: `Error in mapData: ${err}`,
        log: err,
      });
    }
  },

  getProccessedData: async (
    res: Response,
    req: Request,
    next: NextFunction
  ): Promise<void> => {
    try {
      const functionName = req.body.name;
      res.locals.data = await visData.find({ functionName: functionName });
      return next();
    } catch (err) {
      next({
        message: `Error in mapData: ${err}`,
        log: err,
      });
    }
  },
};
