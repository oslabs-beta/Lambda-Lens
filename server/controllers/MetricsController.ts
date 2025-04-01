import { Request, Response, NextFunction } from 'express';
import { MetricsProcessingService, MetricData, PercentileData } from '../services/MetricsProcessingService';
import { CacheService } from '../services/CacheService';
import { MetricsValidator } from '../utils/validators';
import { FormattedLog } from '../types';

interface MetricProcessingStrategy<T> {
  process(userId: string, functionNames: string[]): Promise<T>;
  getCacheKey(): string;
}

abstract class BaseMetricStrategy<T> implements MetricProcessingStrategy<T> {
  constructor(protected metricsService: MetricsProcessingService) {}
  abstract process(userId: string, functionNames: string[]): Promise<T>;
  abstract getCacheKey(): string;
}

class LogProcessingStrategy extends BaseMetricStrategy<{ functionName: string; logs: FormattedLog[] }[]> {
  async process(userId: string, functionNames: string[]): Promise<{ functionName: string; logs: FormattedLog[] }[]> {
    return this.metricsService.getProcessedLogs(userId, functionNames);
  }

  getCacheKey() { return 'log_data'; }
}

class CloudWatchMetricsStrategy extends BaseMetricStrategy<MetricData[]> {
  async process(userId: string, functionNames: string[]): Promise<MetricData[]> {
    return this.metricsService.getCloudWatchMetrics(userId, functionNames);
  }

  getCacheKey() { return 'cloudwatch_metrics'; }
}

class PercentileMetricsStrategy extends BaseMetricStrategy<PercentileData> {
  async process(userId: string, functionNames: string[]): Promise<PercentileData> {
    return this.metricsService.getPercentileMetrics(userId, functionNames);
  }

  getCacheKey() { return 'percentile_metrics'; }
}


class MetricsController {
  private static instance: MetricsController;
  private readonly metricsService: MetricsProcessingService;
  private readonly cacheService: CacheService;
  private readonly strategies: Map<string, MetricProcessingStrategy<any>>;

  private constructor() {
    this.metricsService = MetricsProcessingService.getInstance();
    this.cacheService = CacheService.getInstance();

    const strategies = new Map<string, MetricProcessingStrategy<any>>();
    strategies.set('cloudwatch', new CloudWatchMetricsStrategy(this.metricsService));
    strategies.set('percentile', new PercentileMetricsStrategy(this.metricsService));
    strategies.set('logs', new LogProcessingStrategy(this.metricsService));
    this.strategies = strategies;

    this.getCloudWatchMetrics = this.getCloudWatchMetrics.bind(this);
    this.getPercentileMetrics = this.getPercentileMetrics.bind(this);
    this.getProcessedLogs = this.getProcessedLogs.bind(this);
  }

  public static getInstance(): MetricsController {
    if (!MetricsController.instance) {
      MetricsController.instance = new MetricsController();
    }
    return MetricsController.instance;
  }

  private async processMetrics<T>(userId: string, strategy: MetricProcessingStrategy<T>, functionNames: string[]): Promise<T> {
    if (!userId) {
        throw new Error("User ID is required for processing metrics.");
    }
    const cacheKey = `${userId}:${strategy.getCacheKey()}:${functionNames.sort().join(',')}`;
    const cachedData = this.cacheService.get<T>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for ${cacheKey}`);
      return cachedData;
    }
    console.log(`Cache miss for ${cacheKey}`);

    const data = await strategy.process(userId, functionNames);
    this.cacheService.set(cacheKey, data);
    return data;
  }


  public async getProcessedLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.uid;
      if (!userId) throw new Error('Authentication required.');

      const functionNames = res.locals.functionNames as string[];
      if (!functionNames) throw new Error('Function names not found.');
      MetricsValidator.validateFunctionNames(functionNames);

      const strategy = this.strategies.get('logs') as LogProcessingStrategy;
      if (!strategy) throw new Error('Log processing strategy not found');

      res.locals.allData = await this.processMetrics(userId, strategy, functionNames);
      return next();
    } catch (error) {
      next({
        log: `Error in MetricsController.getProcessedLogs: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 500,
        message: { err: error instanceof Error ? error.message : 'Error occurred when retrieving log data' },
      });
    }
  }

  public async getCloudWatchMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.uid;
      if (!userId) throw new Error('Authentication required.');

      const functionNames = res.locals.functionNames as string[];
      if (!functionNames) throw new Error('Function names not found.');
      MetricsValidator.validateFunctionNames(functionNames);

      const strategy = this.strategies.get('cloudwatch') as CloudWatchMetricsStrategy;
      if (!strategy) throw new Error('CloudWatch metrics strategy not found');

      res.locals.cloudData = await this.processMetrics(userId, strategy, functionNames);
      return next();
    } catch (error) {
      next({
        log: `Error in MetricsController.getCloudWatchMetrics: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 500,
        message: { err: error instanceof Error ? error.message : 'Error occurred when retrieving CloudWatch metrics' },
      });
    }
  }

  public async getPercentileMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.uid;
      if (!userId) throw new Error('Authentication required.');

      const functionNames = res.locals.functionNames as string[];
      if (!functionNames) throw new Error('Function names not found.');
      MetricsValidator.validateFunctionNames(functionNames);

      const strategy = this.strategies.get('percentile') as PercentileMetricsStrategy;
      if (!strategy) throw new Error('Percentile metrics strategy not found');

      res.locals.metricData = await this.processMetrics(userId, strategy, functionNames);
      return next();
    } catch (error) {
      next({
        log: `Error in MetricsController.getPercentileMetrics: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 500,
        message: { err: error instanceof Error ? error.message : 'Error occurred when retrieving percentile metrics' },
      });
    }
  }
}

const metricsController = MetricsController.getInstance();
export default metricsController;