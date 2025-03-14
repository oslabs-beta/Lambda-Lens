import { Document } from 'mongoose';

export interface FormattedLog {
  Date: string;
  Time: string;
  FunctionName: string;
  duration: string;
  BilledDuration: string;
  InitDuration?: string;
  MaxMemUsed: string;
}

export interface RawMetricsData {
  functionName: string;
  logs: FormattedLog[];
}

export interface ProcessedMetricsResult {
  functionName: string;
  avgBilledDur: number;
  numColdStarts: number;
  percentColdStarts: number;
  region: string;
}

export interface MetricsDocument extends Document {
  region: string;
  functionName: string;
  avgBilledDur: number;
  numColdStarts: number;
  percentColdStarts: number;
}