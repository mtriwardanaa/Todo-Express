import { Router, Request, Response, NextFunction } from 'express';
import {
  getData,
  createData,
  updateData,
  deleteData,
} from '../../Modules/project/controllers/project-controller';

const router = Router();

router.get('/ping', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Pong project route' });
});

router.get('/', getData);
router.post('/create', createData);
router.put('/update/:id', updateData);
router.delete('/delete/:id', deleteData);

export default router;
