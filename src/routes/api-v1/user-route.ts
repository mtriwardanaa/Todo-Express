import { Router, Request, Response, NextFunction } from 'express';
import {
  getData,
  createData,
  updateData,
  deleteData,
  login,
} from '../../Modules/user/controllers/user-controller';

const router = Router();

router.get('/ping', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Pong user route' });
});

router.get('/', getData);
// router.get("/get/:id", controller.getOneData);
router.post('/create', createData);
router.put('/update/:id', updateData);
router.delete('/delete/:id', deleteData);
router.post('/login/', login);

export default router;
