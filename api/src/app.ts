import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import 'express-async-errors';
import createConnection from './database';
import routes from './routes';
import { AppError } from './errors/AppError';
import authorization from './services/auth';

const app = express();

createConnection();
app.use(express.json());

app.use(cors());

const auth = authorization();
app.use(auth.initialize());

app.use(routes({ auth }));

app.use((error: Error, request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }

  return response.status(500).json({
    status: 'Error',
    message: `Internal server error ${error.message}`,
  });
});

export { app };
