import { NextFunction, Response, Request } from 'express';
import winston from 'winston';
import { MyTransport } from '../utils/transport';

interface Error {
  name?: string;
  stack?: string;
  message?: string;
  status?: number;
}

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || 'something wrong';

  const logger = winston.createLogger({
    transports: [
      new MyTransport({
        handleExceptions: true,
        handleRejections: true,
      }),
    ],
  });

  logger.error(message);

  res.status(status).json({ status, message });
};

export default errorHandler;
