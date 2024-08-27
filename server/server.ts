import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
// import { getFunctions } from './controllers/getFunctionsController';
// import { getLogs } from './controllers/lambdaController';
import connectToDatabase from './models/dbConnection';
// import Log from './models/lambdaModel';
// import { FormattedLog } from './types';
import lambdaController from './controllers/lambdaController'; 

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

// Connect to the database
connectToDatabase().then(() => {
  console.log('Database connected');
}).catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});

// app.use(async (req: Request, res: Response, next: NextFunction) => {
//   try {
 
//     const functionNames = await getFunctions();

//     if (functionNames.length === 0) {
//       return res.status(404).json({ error: 'No Lambda functions found' });
//     }

//     const logGroupNames = functionNames.map(name => `/aws/lambda/${name}`);

  
//     for (const logGroupName of logGroupNames) {
//       await getLogs([logGroupName]);
//     }

//     const alldata: { functionName: string; logs: FormattedLog[] }[] = [];

//     for (const logGroupName of logGroupNames) {

//       const functionName = logGroupName.replace('/aws/lambda/', '');
  
//       const logs = await Log.find({ FunctionName: logGroupName });

//       const formattedLogs: FormattedLog[] = logs.map(log => ({
//         Date: log.Date || '', 
//         Time: log.Time || '', 
//         BilledDuration: log.BilledDuration || '', 
//         MaxMemUsed: log.MaxMemUsed || '', 
//         InitDuration: log.InitDuration || '',
//       }));

//       const data = {
//         functionName: functionName,
//         logs: formattedLogs
//       };

//       alldata.push(data);
//     }

//     // Store the data in res.locals
//     res.locals.alldata = alldata;

//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// app.get('/logs', (req: Request, res: Response) => {

//   const alldata = res.locals.alldata;

//   res.json(alldata);
// });

// Route to fetch and process logs
app.get('/logs', lambdaController.processLogs, (req, res) => {
  // Since processLogs middleware sets res.locals.alldata
  const alldata = res.locals.alldata;
  res.json(alldata);
});

// Route for health check or simple response
app.get('/', (req: Request, res: Response) => {
  res.send('Hello');
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
