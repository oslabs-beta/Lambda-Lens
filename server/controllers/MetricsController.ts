import { Request, Response, NextFunction } from 'express';
import { getFunction } from './getFunctionsController';
import { MetricsProcessingService, MetricData, PercentileData } from '../services/MetricsProcessingService';
import { CacheService } from '../services/CacheService';
import { MetricsValidator } from '../utils/validators';

// Strategy interface with generic return type
interface MetricProcessingStrategy<T> {
  process(functionNames: string[]): Promise<T>;
  getCacheKey(): string;
}

abstract class BaseMetricStrategy<T> implements MetricProcessingStrategy<T> {
  constructor(protected metricsService: MetricsProcessingService) {}
  abstract process(functionNames: string[]): Promise<T>;
  abstract getCacheKey(): string;
}

class CloudWatchMetricsStrategy extends BaseMetricStrategy<MetricData[]> {
  process(functionNames: string[]) {
    return this.metricsService.getCloudWatchMetrics(functionNames);
  }

  getCacheKey() {
    return 'cloudwatch_metrics';
  }
}

class PercentileMetricsStrategy extends BaseMetricStrategy<PercentileData> {
  process(functionNames: string[]) {
    return this.metricsService.getPercentileMetrics(functionNames);
  }

  getCacheKey() {
    return 'percentile_metrics';
  }
}

class MetricsController {
  private static instance: MetricsController;
  private readonly metricsService: MetricsProcessingService;
  private readonly cacheService: CacheService;
  private readonly strategies: Map<string, MetricProcessingStrategy<any>>;

  private constructor() {
    this.metricsService = MetricsProcessingService.getInstance();
    this.cacheService = CacheService.getInstance();
    
    // Initialize strategies separately to help type inference
    const strategies = new Map<string, MetricProcessingStrategy<any>>();
    strategies.set('cloudwatch', new CloudWatchMetricsStrategy(this.metricsService));
    strategies.set('percentile', new PercentileMetricsStrategy(this.metricsService));
    this.strategies = strategies;

    // Bind methods to this instance
    this.getCloudWatchMetrics = this.getCloudWatchMetrics.bind(this);
    this.getPercentileMetrics = this.getPercentileMetrics.bind(this);
  }

  public static getInstance(): MetricsController {
    if (!MetricsController.instance) {
      MetricsController.instance = new MetricsController();
    }
    return MetricsController.instance;
  }

  private async processMetrics<T>(strategy: MetricProcessingStrategy<T>, functionNames: string[]): Promise<T> {
    const cacheKey = strategy.getCacheKey();
    const cachedData = this.cacheService.get(cacheKey);

    if (cachedData) {
      return cachedData as T;
    }

    const metricsData = await strategy.process(functionNames);
    this.cacheService.set(cacheKey, metricsData);
    return metricsData;
  }

  public async getCloudWatchMetrics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const functionNames = await getFunction();
      MetricsValidator.validateFunctionNames(functionNames);
      
      const strategy = this.strategies.get('cloudwatch') as CloudWatchMetricsStrategy;
      if (!strategy) {
        throw new Error('CloudWatch metrics strategy not found');
      }

      res.locals.cloudData = await this.processMetrics(strategy, functionNames);
      return next();
    } catch (error) {
      next({
        log: 'Error in MetricsController.getCloudWatchMetrics',
        status: 500,
        message: { err: error instanceof Error ? error.message : 'Error occurred when retrieving CloudWatch metrics' },
      });
    }
  }

  public async getPercentileMetrics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const functionNames = await getFunction();
      MetricsValidator.validateFunctionNames(functionNames);
      
      const strategy = this.strategies.get('percentile') as PercentileMetricsStrategy;
      if (!strategy) {
        throw new Error('Percentile metrics strategy not found');
      }

      res.locals.metricData = await this.processMetrics(strategy, functionNames);
      return next();
    } catch (error) {
      next({
        log: 'Error in MetricsController.getPercentileMetrics',
        status: 500,
        message: { err: error instanceof Error ? error.message : 'Error occurred when retrieving percentile metrics' },
      });
    }
  }
}

const metricsController = MetricsController.getInstance();
export default metricsController;