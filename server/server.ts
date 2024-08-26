import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { getLogs } from './controllers/lambdaController';
import { getMetricData } from './controllers/metricController';
import connectToDatabase from './models/dbConnection';
import Log from './models/lambdaModel';

dotenv.config();
const app = express();

const PORT = 8080;

app.use(bodyParser.json());
app.use(cors());

connectToDatabase().then(() => {
  console.log('Server Started')
});

const start = async () => {
  await connectToDatabase();
  await getLogs();
};

start().catch(error => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
console.log('db connected',connectToDatabase());

// Define routes
app.get('/logs', async (req: Request, res: Response) => {
  try {
    const logs = await Log.find();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello');
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
