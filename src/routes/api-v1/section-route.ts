import { Router, Request, Response, NextFunction } from 'express';
import {
  getData,
  createData,
  updateData,
  deleteData,
  getOneData,
} from '../../Modules/task/controllers/section-controller';

const router = Router();

router.get('/ping', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Pong section route' });
});

router.get('/', getData);
router.get('/:id', getOneData);
router.post('/create', createData);
router.put('/update/:id', updateData);
router.delete('/delete/:id', deleteData);

export default router;
