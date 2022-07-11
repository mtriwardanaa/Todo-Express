import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../configs/config';
import { checkUser } from '../utils/token';

const handleAuthorizedError = (next: NextFunction) => {
  const error: Error = new Error('Login error: please try again');
  error.status = 401;
  next(error);
};

interface Error {
  name?: string;
  stack?: string;
  message?: string;
  status?: number;
}

const validateTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.get('Authorization');
    if (authHeader) {
      const bearer = authHeader.split(' ')[0].toLowerCase();
      const token = authHeader.split(' ')[1];
      if (token && bearer === 'bearer') {
        const decode = checkUser(token);
        if (decode) {
          next();
        } else {
          handleAuthorizedError(next);
        }
      } else {
        handleAuthorizedError(next);
      }
    } else {
      handleAuthorizedError(next);
    }
  } catch (error) {
    handleAuthorizedError(next);
  }
};

export default validateTokenMiddleware;
