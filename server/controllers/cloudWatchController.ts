import { Request, Response, NextFunction } from 'express';
import { getFunction } from './getFunctionsController';
import { MetricsProcessingService } from '../services/MetricsProcessingService';
import { CacheService } from '../services/CacheService';
import { MetricsValidator } from '../utils/validators';

export const getMetricData = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const functionNames = await getFunction();
    MetricsValidator.validateFunctionNames(functionNames);

    const cacheService = CacheService.getInstance();
    const cacheKey = 'cloudwatch_metrics';
    const cachedData = cacheService.get(cacheKey);

    if (cachedData) {
      res.locals.cloudData = cachedData;
      return next();
    }

    const metricsService = MetricsProcessingService.getInstance();
    const metricsData = await metricsService.getCloudWatchMetrics(functionNames);

    cacheService.set(cacheKey, metricsData);
    res.locals.cloudData = metricsData;
    
    return next();
  } catch (error) {
    return next({
      log: 'Error in cloudWatchController.getMetricData',
      status: 500,
      message: { err: error instanceof Error ? error.message : 'Error occurred when retrieving Cloudwatch Metrics.' },
    });
  }
};