import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import configRoutes from './routes/configRoutes';
import dataRoutes from './routes/dataRoutes';
import healthRoutes from './routes/healthRoutes';
import chatRoutes from './routes/chatRoutes';
import { AwsClientService } from './services/AwsClientService';

// Load environment variables, but don't throw if .env is missing
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Initialize AWS client service with any existing config
try {
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_REGION) {
    const awsClientService = AwsClientService.getInstance();
    awsClientService.updateConfig({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
    });
    console.log('AWS configuration loaded from environment');
  } else {
    console.log('No AWS configuration found - waiting for configuration through UI');
  }
} catch (error) {
  console.error('Error initializing AWS configuration:', error);
}

app.use('/api/config', configRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello');
});

app.use((_req: Request, res: Response) => {
  return res.status(404).send('This is not the page you\'re looking for');
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };

  // Add better error messages for AWS credential errors
  if (err.message?.includes('credentials')) {
    defaultErr.message.err = 'AWS credentials are not configured. Please configure them in the settings page.';
  }

  const errorObj = Object.assign({}, defaultErr, err);
  console.error(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
