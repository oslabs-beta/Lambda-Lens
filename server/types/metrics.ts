import { Document } from 'mongoose';

export interface LogEntry {
  Date: string;
  Time: string;
  FunctionName: string;
  BilledDuration: string;
  InitDuration?: string;
  MaxMemUsed: string;
}

export interface RawMetricsData {
  functionName: string;
  logs: LogEntry[];
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