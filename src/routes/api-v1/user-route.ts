import { Router, Request, Response, NextFunction } from 'express';
import {
  getData,
  createData,
  updateData,
  deleteData,
  login,
} from '../../Modules/user/controllers/user-controller';
import authMiddleware from '../../middlewares/auth-middleware';

const router = Router();

router.get('/ping', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Pong user route' });
});

router.post('/create', createData);
router.post('/login/', login);

router.use(authMiddleware);
router.get('/', getData);
router.put('/update/:id', updateData);
router.delete('/delete/:id', deleteData);

export default router;
