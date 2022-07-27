import { NextFunction, Response, Request } from 'express';

interface Erroree {
  name?: string;
  stack?: string;
  message?: string;
  status?: number;
}

const errorHandler = (
  error: Erroree,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || 'something wrong';

  res.status(status).json({ status, message });
};

export default errorHandler;
