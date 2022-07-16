import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user-service';

class UserController {
  constructor(private readonly _userService: UserService) {}

  getData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this._userService.getUser();
      res.json({
        status: 'success',
        data,
        message: 'get user success',
      });
    } catch (error) {
      next(error);
    }
  };

  getOneData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await this._userService.getOneUser(id);
      if (data != null) {
        res.json({
          status: 'success',
          data,
          message: 'get user success',
        });
      } else {
        res.json({
          status: 'fail',
          message: 'user not found',
        });
      }
    } catch (error) {
      next(error);
    }
  };

  createData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this._userService.createUser(req.body);
      res.json({
        status: 'success',
        data,
        message: 'create user success',
      });
    } catch (error) {
      next(error);
    }
  };

  updateData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const update = await this._userService.updateUser(
        req.body,
        req.params.id
      );
      if (update.status) {
        res.json({
          status: 'success',
          data: update.data,
          message: 'update user success',
        });
      } else {
        res.json({
          status: 'fail',
          message: update.message,
        });
      }
    } catch (error) {
      next(error);
    }
  };

  deleteData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleteUser = await this._userService.deleteUser(req.params.id);
      if (deleteUser.status) {
        res.json({
          status: 'success',
          data: deleteUser.data,
          message: 'delete user success',
        });
      } else {
        res.json({
          status: 'fail',
          message: deleteUser.message,
        });
      }
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      const data = await this._userService.login(username, password);
      console.log(data);
      if (!data.status) {
        res.json({
          status: 'fail',
          message: data.message,
        });
      } else {
        res.json({
          status: 'success',
          data,
          message: 'login user success',
        });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
