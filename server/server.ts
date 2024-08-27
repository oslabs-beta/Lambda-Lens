import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDatabase from './models/dbConnection';
import lambdaController from './controllers/lambdaController'; 
import { getFunction } from './controllers/getFunctionsController';
import configRoutes from './routes/configRoutes';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json()); 
app.use(cors()); 
app.use(express.json()); 


connectToDatabase().then(() => {
  console.log('Database connected');
}).catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});

// app.get('/api', getFunction, (_req: Request, res: Response, _next: NextFunction) => {
//   console.log('res.locals.functionsList from server.ts: ', res.locals.functionsList);
//   res.status(200).send(res.locals.functionsList);
// });

app.get('/logs', lambdaController.processLogs, (req: Request, res: Response) => {
  const alldata = res.locals.alldata;
  res.json(alldata);
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err.message });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});