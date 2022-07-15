import { NextFunction, Request, Response } from 'express';
import SectionService from '../services/section-service';

class SectionController {
  constructor(private readonly _sectionService: SectionService) {}

  getData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const list = await this._sectionService.getSection(projectId);
      if (list.status) {
        res.json({
          status: 'success',
          data: list.data,
          message: 'get section success',
        });
      }
      res.json({
        status: 'fail',
        message: list.message,
      });
    } catch (error) {
      next(error);
    }
  };

  getOneData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const check = await this._sectionService.getOneSection(id);
      if (check != null) {
        res.json({
          status: 'success',
          data: check,
          message: 'get one section success',
        });
      }
      res.json({
        status: 'fail',
        message: 'section not found',
      });
    } catch (error) {
      next(error);
    }
  };

  createData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const create = await this._sectionService.createSection(
        req.body,
        projectId
      );

      if (create.status) {
        res.json({
          status: 'success',
          create,
          message: 'create section success',
        });
      }
      res.json({
        status: 'fail',
        message: create.message,
      });
    } catch (error) {
      next(error);
    }
  };

  updateData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const update = await this._sectionService.updateSection(
        req.body,
        req.params.id
      );
      if (update.status) {
        res.json({
          status: 'success',
          update,
          message: 'update section success',
        });
      }
      res.json({
        status: 'fail',
        message: update.message,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleteSec = await this._sectionService.deleteSection(req.params.id);
      if (deleteSec.status) {
        res.json({
          status: 'success',
          deleteSec,
          message: 'delete section success',
        });
      }

      res.json({
        status: 'fail',
        message: deleteSec.message,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default SectionController;
