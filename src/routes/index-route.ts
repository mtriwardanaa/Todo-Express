import { Router, Request, Response, NextFunction } from 'express';
import TodoRoutes from '../routes/api-v1/todo-route';
import UserRoutes from '../routes/api-v1/user-route';
import ProjectRoutes from '../routes/api-v1/project-route';

const router = Router();

router.get('/ping', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Pong index route' });
});

router.use('/todo', TodoRoutes);
router.use('/user', UserRoutes);
router.use('/project', ProjectRoutes);

export default router;
