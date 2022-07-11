import { NextFunction, Request, Response } from 'express';
import ProjectService from '../services/project-service';

const authorize = async (req: Request) => {
  const header = req.headers.authorization;
  if (!header) {
    return '';
  }

  return header.split(' ')[1];
};

const getData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await authorize(req);
    const ampas = await ProjectService.getProject(token as unknown as string);
    res.json({
      status: 'success',
      data: ampas,
      message: 'get project success',
    });
  } catch (error) {
    next(error);
  }
};

const getOneData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const token = await authorize(req);
    const ampas = await ProjectService.getOneProject(
      token as unknown as string,
      id
    );
    res.json({
      status: 'success',
      data: ampas,
      message: 'get one project success',
    });
  } catch (error) {
    next(error);
  }
};

const createData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await authorize(req);
    const ampas = await ProjectService.createProject(
      req.body,
      token as unknown as string
    );
    res.json({
      status: 'success',
      data: ampas,
      message: 'create project success',
    });
  } catch (error) {
    next(error);
  }
};

const updateData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await authorize(req);
    console.log('token');
    console.log(token);
    console.log('token');
    const ampas = await ProjectService.updateProject(
      token as unknown as string,
      req.body,
      req.params.id
    );
    res.json({
      status: 'success',
      data: ampas,
      message: 'update project success',
    });
  } catch (error) {
    next(error);
  }
};

const deleteData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await authorize(req);
    const ampas = await ProjectService.deleteProject(
      req.params.id,
      token as unknown as string
    );
    res.json({
      status: 'success',
      data: ampas,
      message: 'delete project success',
    });
  } catch (error) {
    next(error);
  }
};

export { getData, createData, updateData, deleteData, getOneData };
