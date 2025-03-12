import { Request, Response, NextFunction } from 'express';
import { getFunction } from './getFunctionsController';
import { MetricsProcessingService } from '../services/MetricsProcessingService';
import { CacheService } from '../services/CacheService';
import { MetricsValidator } from '../utils/validators';

const metricsController = {
  async processMetrics(_req: Request, res: Response, next: NextFunction) {
    try {
      const functionNames = await getFunction();
      MetricsValidator.validateFunctionNames(functionNames);

      const cacheService = CacheService.getInstance();
      const cacheKey = 'percentile_metrics';
      const cachedData = cacheService.get(cacheKey);

      if (cachedData) {
        res.locals.metricData = cachedData;
        return next();
      }

      const metricsService = MetricsProcessingService.getInstance();
      const percentileData = await metricsService.getPercentileMetrics(functionNames);

      cacheService.set(cacheKey, percentileData);
      res.locals.metricData = percentileData;
      
      return next();
    } catch (error) {
      next({
        log: 'Error in metricsController.processMetrics',
        status: 500,
        message: { err: error instanceof Error ? error.message : 'Error occurred when fetching Lambda metrics' },
      });
    }
  },
};

export default metricsController;