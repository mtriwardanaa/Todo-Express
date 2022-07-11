import { NextFunction, Request, Response } from 'express';
import SectionService from '../services/section-service';

const getData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ampas = await SectionService.getSection();
    res.json({
      status: 'success',
      data: ampas,
      message: 'get section success',
    });
  } catch (error) {
    next(error);
  }
};

const getOneData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const ampas = await SectionService.getOneSection(id);
    res.json({
      status: 'success',
      data: ampas,
      message: 'get one section success',
    });
  } catch (error) {
    next(error);
  }
};

const createData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ampas = await SectionService.createSection(req.body);
    res.json({
      status: 'success',
      data: ampas,
      message: 'create section success',
    });
  } catch (error) {
    next(error);
  }
};

const updateData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ampas = await SectionService.updateSection(req.body, req.params.id);
    res.json({
      status: 'success',
      data: ampas,
      message: 'update section success',
    });
  } catch (error) {
    next(error);
  }
};

const deleteData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ampas = await SectionService.deleteSection(req.params.id);
    res.json({
      status: 'success',
      data: ampas,
      message: 'delete section success',
    });
  } catch (error) {
    next(error);
  }
};

export { getData, createData, updateData, deleteData, getOneData };
