import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user-service';

const getData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ampas = await UserService.getUser();
    res.json({
      status: 'success',
      data: ampas,
      message: 'get user success',
    });
  } catch (error) {
    next(error);
  }
};

const createData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ampas = await UserService.createUser(req.body);
    res.json({
      status: 'success',
      data: ampas,
      message: 'create user success',
    });
  } catch (error) {
    next(error);
  }
};

const updateData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ampas = await UserService.updateUser(req.body, req.params.id);
    res.json({
      status: 'success',
      data: ampas,
      message: 'update user success',
    });
  } catch (error) {
    next(error);
  }
};

const deleteData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ampas = await UserService.deleteUser(req.params.id);
    res.json({
      status: 'success',
      data: ampas,
      message: 'delete user success',
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const ampas = await UserService.login(username, password);
    res.json({
      status: 'success',
      data: ampas,
      message: 'login user success',
    });
  } catch (error) {
    next(error);
  }
};

export { getData, createData, updateData, deleteData, login };
