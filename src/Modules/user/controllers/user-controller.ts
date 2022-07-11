import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user-service';

class UserController {
  constructor(private readonly _userService: UserService) {}

  getData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ampas = await this._userService.getUser();
      res.json({
        status: 'success',
        data: ampas,
        message: 'get user success',
      });
    } catch (error) {
      next(error);
    }
  };

  createData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ampas = await this._userService.createUser(req.body);
      res.json({
        status: 'success',
        data: ampas,
        message: 'create user success',
      });
    } catch (error) {
      next(error);
    }
  };

  updateData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ampas = await this._userService.updateUser(req.body, req.params.id);
      res.json({
        status: 'success',
        data: ampas,
        message: 'update user success',
      });
    } catch (error) {
      next(error);
    }
  };

  deleteData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ampas = await this._userService.deleteUser(req.params.id);
      res.json({
        status: 'success',
        data: ampas,
        message: 'delete user success',
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      const ampas = await this._userService.login(username, password);
      res.json({
        status: 'success',
        data: ampas,
        message: 'login user success',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
