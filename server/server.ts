import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDatabase from './models/dbConnection';
import lambdaController from './controllers/lambdaController';
import { getFunction } from './controllers/getFunctionsController';
import configRoutes from './routes/configRoutes';
import dataRoutes from './routes/dataRoutes';


dotenv.config();


const app = express();

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

if(process.env.MONGODB_URI){
connectToDatabase()
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
}

// app.get('/api', getFunction, (_req: Request, res: Response, _next: NextFunction) => {
//   console.log('res.locals.functionsList from server.ts: ', res.locals.functionsList);
//   res.status(200).send(res.locals.functionsList);
// });

// app.get('/logs', lambdaController.processLogs, (req: Request, res: Response) => {
//   const alldata = res.locals.alldata;
//   res.json(alldata);
// });
app.use(
  '/api/config',
  configRoutes,
  (_req: Request, res: Response, _next: NextFunction) => {
    return res.status(200).json(res.locals.saved);
  }
);

app.use('/data', dataRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello');
});


//catch-all 404 handler for paths not defined
app.use((_req: Request, res: Response) => {return res.status(404).send('This is not the page you\'re looking for')});

//default global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const defaultErr: {
    log: string, 
    status: number, 
    message: { err: string} } = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
