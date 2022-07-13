import { NextFunction, Request, Response } from 'express';
import SectionService from '../services/section-service';

class SectionController {
  constructor(private readonly _sectionService: SectionService) {}

  getData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const ampas = await this._sectionService.getSection(projectId);
      res.json({
        status: 'success',
        data: ampas,
        message: 'get section success',
      });
    } catch (error) {
      next(error);
    }
  };

  getOneData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const ampas = await this._sectionService.getOneSection(id);
      res.json({
        status: 'success',
        data: ampas,
        message: 'get one section success',
      });
    } catch (error) {
      next(error);
    }
  };

  createData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const ampas = await this._sectionService.createSection(
        req.body,
        projectId
      );
      res.json({
        status: 'success',
        data: ampas,
        message: 'create section success',
      });
    } catch (error) {
      next(error);
    }
  };

  updateData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ampas = await this._sectionService.updateSection(
        req.body,
        req.params.id
      );
      res.json({
        status: 'success',
        data: ampas,
        message: 'update section success',
      });
    } catch (error) {
      next(error);
    }
  };

  deleteData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ampas = await this._sectionService.deleteSection(req.params.id);
      res.json({
        status: 'success',
        data: ampas,
        message: 'delete section success',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default SectionController;
