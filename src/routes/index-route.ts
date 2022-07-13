import { Router, Request, Response, NextFunction } from 'express';
import TodoRoutes from '../routes/api-v1/todo-route';
import UserRoutes from '../routes/api-v1/user-route';
import ProjectRoutes from '../routes/api-v1/project-route';
import SectionRoutes from '../routes/api-v1/section-route';
import authMiddleware from '../middlewares/auth-middleware';

const router = Router();

router.get('/ping', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Pong index route' });
});

router.use('/todo', TodoRoutes);
router.use('/user', UserRoutes);

router.use(authMiddleware);
router.use('/project', ProjectRoutes);
router.use('/section', SectionRoutes);

export default router;
