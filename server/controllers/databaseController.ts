import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../services/DatabaseService';
import { RawMetricsData } from '../types/metrics';

class DatabaseController {
  private static instance: DatabaseController;
  private databaseService: DatabaseService;

  private constructor() {
    this.databaseService = DatabaseService.getInstance();
  }

  public static getInstance(): DatabaseController {
    if (!DatabaseController.instance) {
      DatabaseController.instance = new DatabaseController();
    }
    return DatabaseController.instance;
  }

  public processData = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const rawData: RawMetricsData[] = res.locals.allData;
      await this.databaseService.processAndSaveMetrics(rawData);
      return next();
    } catch (err) {
      next({
        log: 'Error in DatabaseController.processData',
        status: 500,
        message: { 
          err: err instanceof Error ? err.message : 'Error occurred when processing and saving metrics data.'
        },
      });
    }
  };

  public getProcessedData = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.locals.data = await this.databaseService.getMetricsByRegion();
      return next();
    } catch (err) {
      next({
        log: 'Error in DatabaseController.getProcessedData',
        status: 500,
        message: { 
          err: err instanceof Error ? err.message : 'Error occurred when retrieving metrics data'
        },
      });
    }
  };

  public async checkHealth(): Promise<boolean> {
    return await this.databaseService.healthCheck();
  }
}

const databaseController = DatabaseController.getInstance();
export { databaseController };
