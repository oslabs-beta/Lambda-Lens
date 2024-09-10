import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
// import connectToDatabase from './models/dbConnection';
// import { getFunction } from './controllers/getFunctionsController';
import configRoutes from './routes/configRoutes';
import dataRoutes from './routes/dataRoutes';


dotenv.config();


const app = express();

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

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
app.use((_req: Request, res: Response) => {
  return res.status(404).send("This is not the page you're looking for");
});

//default global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const defaultErr: {
    log: string;
    status: number;
    message: { err: string };
  } = {
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
