import express, { NextFunction, Request, Response } from 'express';
const app = express();

const PORT = 8080;

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello');
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
