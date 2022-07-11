import { Router, Request, Response, NextFunction } from 'express';
import UserController from '../../Modules/user/controllers/user-controller';
import authMiddleware from '../../middlewares/auth-middleware';
import UserService from '../../Modules/user/services/user-service';
import UserRepo from '../../Modules/user/repositories/user-repo';

const router = Router();
const repository = new UserRepo();
const service = new UserService(repository);
const _userController = new UserController(service);

router.get('/ping', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Pong user route' });
});

router.post('/create', _userController.createData);
router.post('/login/', _userController.login);

router.use(authMiddleware);
router.get('/', _userController.getData);
router.put('/update/:id', _userController.updateData);
router.delete('/delete/:id', _userController.deleteData);

export default router;
