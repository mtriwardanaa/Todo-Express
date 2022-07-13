import { NextFunction, Request, Response } from 'express';
import ProjectService from '../services/project-service';

class ProjectController {
  constructor(private readonly _projectService: ProjectService) {}

  authorize = async (req: Request, callback: any = 'id') => {
    const header = req.headers.authorization;
    if (!header) {
      return '';
    }

    const payload = JSON.parse(
      Buffer.from(header.split('.')[1], 'base64').toString()
    );
    return payload.user.id;
  };

  getData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = await this.authorize(req);
      const ampas = await this._projectService.getProject(user_id);
      res.json({
        status: 'success',
        data: ampas,
        message: 'get project success',
      });
    } catch (error) {
      next(error);
    }
  };

  getOneData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const ampas = await this._projectService.getOneProject(id);
      res.json({
        status: 'success',
        data: ampas,
        message: 'get one project success',
      });
    } catch (error) {
      next(error);
    }
  };

  createData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = await this.authorize(req);
      const ampas = await this._projectService.createProject(req.body, user_id);
      res.json({
        status: 'success',
        data: ampas,
        message: 'create project success',
      });
    } catch (error) {
      next(error);
    }
  };

  updateData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = await this.authorize(req);
      const ampas = await this._projectService.updateProject(
        user_id,
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

  deleteData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = await this.authorize(req);
      const ampas = await this._projectService.deleteProject(
        req.params.id,
        user_id
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
}

export default ProjectController;
