import { NextFunction, Request, Response } from 'express';
import ProjectService from '../services/project-service';

const getData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ampas = await ProjectService.getProject();
    res.json({
      status: 'success',
      data: ampas,
      message: 'get project success',
    });
  } catch (error) {
    next(error);
  }
};

const createData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ampas = await ProjectService.createProject(req.body);
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
    const ampas = await ProjectService.updateProject(req.body, req.params.id);
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
    const ampas = await ProjectService.deleteProject(req.params.id);
    res.json({
      status: 'success',
      data: ampas,
      message: 'delete project success',
    });
  } catch (error) {
    next(error);
  }
};

export { getData, createData, updateData, deleteData };
