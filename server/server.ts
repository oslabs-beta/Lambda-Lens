import express, { NextFunction, Request, Response } from 'express';
import { getLogs } from './controllers/lambdaController';
import configRoutes from './routes/configRoutes';
const cors = require('cors');



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


app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello');
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
