import { Router, Request, Response, NextFunction } from 'express';
import authMiddleware from '../../middlewares/auth-middleware';
import UserController from '../../Modules/user/controllers/user-controller';
import UserService from '../../Modules/user/services/user-service';
import UserRepo from '../../Modules/user/repositories/user-repo';
import { ValidateJoi } from '../../middlewares/validate-req';
import { Schema } from '../../Modules/user/validations/user-validate';

const router = Router();
const repository = new UserRepo();
const service = new UserService(repository);
const _userController = new UserController(service);

router.get('/ping', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Pong user route' });
});

router.post('/create', ValidateJoi(Schema.create), _userController.createData);
router.post('/login/', ValidateJoi(Schema.login), _userController.login);

router.use(authMiddleware);
router.get('/', _userController.getData);
router.get('/:id', _userController.getOneData);
router.put(
  '/update/:id',
  ValidateJoi(Schema.update),
  _userController.updateData
);
router.delete('/delete/:id', _userController.deleteData);

export default router;
