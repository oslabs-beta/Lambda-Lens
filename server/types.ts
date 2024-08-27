<<<<<<< HEAD
export interface Config {
=======
export type Config = {
  region: string;
>>>>>>> dev
    credentials: {
      accessKeyId: string;
      secretAccessKey: string;
    };
<<<<<<< HEAD
    region: string;
  };

  export interface FormattedLog {
    Date: string;
    Time: string;
    BilledDuration?: string;
    MaxMemUsed?: string;
    InitDuration?: string;
    FunctionName?: string;
  }
=======
  };
>>>>>>> dev
