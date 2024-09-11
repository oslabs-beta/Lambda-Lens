export interface Config {
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  region: string;
}

export type GetAwsConfig = () => Config;

export interface FormattedLog {
  Date: string;
  Time: string;
  BilledDuration?: string;
  MaxMemUsed?: string;
  InitDuration?: string;
  FunctionName?: string;
}
