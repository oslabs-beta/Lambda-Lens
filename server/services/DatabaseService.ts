import visData from '../models/visDataModel';
import { getAwsConfig } from '../configs/awsconfig';
import { RawMetricsData, ProcessedMetricsResult } from '../types/metrics';
import mongoose from 'mongoose';

class DatabaseServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseServiceError';
  }
}

export class DatabaseService {
  private static instance: DatabaseService;
  private readonly BATCH_SIZE = 5;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private processBatch(batch: RawMetricsData[], region: string): ProcessedMetricsResult[] {
    if (!batch || !Array.isArray(batch)) {
      throw new DatabaseServiceError('Invalid batch data provided');
    }

    return batch.map(func => {
      if (!func.logs || !Array.isArray(func.logs)) {
        throw new DatabaseServiceError(`Invalid logs data for function ${func.functionName}`);
      }

      let totalStarts = func.logs.length + 1;
      let billed = 0;
      let cold = 0;

      for (const log of func.logs) {
        const billedDuration = parseInt(log.BilledDuration, 10);
        if (isNaN(billedDuration)) {
          throw new DatabaseServiceError(`Invalid billed duration in logs for function ${func.functionName}`);
        }
        billed += billedDuration;
        if (log.InitDuration) cold++;
      }

      const percentCold = totalStarts > 0 ? (cold / totalStarts) * 100 : 0;

      return {
        functionName: func.functionName,
        avgBilledDur: billed,
        numColdStarts: cold,
        percentColdStarts: percentCold,
        region
      };
    });
  }

  private async saveBatch(results: ProcessedMetricsResult[]): Promise<void> {
    try {
      await Promise.all(
        results.map(result =>
          visData.findOneAndUpdate(
            { functionName: result.functionName, region: result.region },
            {
              region: result.region,
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
    } catch (error) {
      throw new DatabaseServiceError(
        `Failed to save batch to database: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  public async processAndSaveMetrics(rawData: RawMetricsData[]): Promise<void> {
    if (!rawData || !Array.isArray(rawData)) {
      throw new DatabaseServiceError('Invalid raw data provided');
    }

    const { region } = getAwsConfig();
    if (!region) {
      throw new DatabaseServiceError('AWS region not configured');
    }

    for (let i = 0; i < rawData.length; i += this.BATCH_SIZE) {
      const batch = rawData.slice(i, i + this.BATCH_SIZE);
      const processedBatch = this.processBatch(batch, region);
      await this.saveBatch(processedBatch);
    }
  }

  public async getMetricsByRegion(): Promise<ProcessedMetricsResult[]> {
    const { region } = getAwsConfig();
    if (!region) {
      throw new DatabaseServiceError('AWS region not configured');
    }

    try {
      return await visData.find({ region }).lean();
    } catch (error) {
      throw new DatabaseServiceError(
        `Failed to fetch metrics from database: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const state = mongoose.connection.readyState;
      if (state !== 1) {
        throw new DatabaseServiceError('Database connection is not active');
      }
      await visData.findOne().exec();
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}