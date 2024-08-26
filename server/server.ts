import express, { NextFunction, Request, Response } from 'express';
import { getLogs } from './controllers/lambdaController';
import configRoutes from './routes/configRoutes';
const cors = require('cors');


import { getFunctionsController } from './controllers/getFunctionsController';
import { get } from 'http';

const app = express();

const PORT = 8080;

app.use(express.json());
app.use(cors());

// Configuration router
console.log('Config route confirmation')
app.use('/api/config', configRoutes);

// call func getLogs to perform async 
getLogs().then(() => {
  // console once getLogs successfully
  console.log('Log fetching completed');
}).catch(err => {
  console.log('Error fetching logs:', err.message)
})



//to test, run npm start in the server direcotry then send a postman request to localhost:8080/api
app.get('/api', getFunctionsController.listFunctionData, (_req: Request, res: Response, _next: NextFunction) => {
  console.log('res.locals.functionsList from server.ts: ', res.locals.functionsList);
  res.send(res.locals.functionsList);
})

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello');
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
