import express, { NextFunction, Request, Response, Express } from 'express';
import routes from '../routes/index-route';
import ErrorHandler from '../middlewares/error-handler';

const startServer = (router: Express) => {
  console.log('start server');
  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  /** Rules of our API */
  router.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method == 'OPTIONS') {
      res.header(
        'Access-Control-Allow-Methods',
        'PUT, POST, PATCH, DELETE, GET'
      );
      return res.status(200).json({});
    }

    next();
  });

  router.use('/api', routes);

  router.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error('Not found');
    next(error);
  });

  router.use(ErrorHandler);
};

export default startServer;
