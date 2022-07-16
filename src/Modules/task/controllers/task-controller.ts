import { NextFunction, Request, Response } from 'express';
import TaskService from '../services/task-service';

class TaskController {
  constructor(private readonly _taskService: TaskService) {}

  getData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const list = await this._taskService.getTask(projectId);
      if (list.status) {
        res.json({
          status: 'success',
          data: list.data,
          message: 'get task success',
        });
      } else {
        res.json({
          status: 'fail',
          message: list.message,
        });
      }
    } catch (error) {
      next(error);
    }
  };

  getOneData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const check = await this._taskService.getOneTask(id);
      if (check != null) {
        res.json({
          status: 'success',
          data: check,
          message: 'get one task success',
        });
      } else {
        res.json({
          status: 'fail',
          message: 'task not found',
        });
      }
    } catch (error) {
      next(error);
    }
  };

  createData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const create = await this._taskService.createTask(req.body, projectId);

      if (create.status) {
        res.json({
          status: 'success',
          create,
          message: 'create task success',
        });
      } else {
        res.json({
          status: 'fail',
          message: create.message,
        });
      }
    } catch (error) {
      next(error);
    }
  };

  updateData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const update = await this._taskService.updateTask(
        req.body,
        req.params.id
      );
      if (update.status) {
        res.json({
          status: 'success',
          update,
          message: 'update task success',
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
      const deleteSec = await this._taskService.deleteTask(req.params.id);
      if (deleteSec.status) {
        res.json({
          status: 'success',
          deleteSec,
          message: 'delete task success',
        });
      } else {
        res.json({
          status: 'fail',
          message: deleteSec.message,
        });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default TaskController;
