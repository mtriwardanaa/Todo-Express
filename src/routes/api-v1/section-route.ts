import { Router, Request, Response, NextFunction } from 'express';
import SectionController from '../../Modules/task/controllers/section-controller';
import SectionService from '../../Modules/task/services/section-service';
import SectionRepo from '../../Modules/task/repositories/section-repo';

const router = Router();
const repository = new SectionRepo();
const service = new SectionService(repository);
const _sectionController = new SectionController(service);

router.get('/ping', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Pong section route' });
});

router.get('/project/:projectId', _sectionController.getData);
router.get('/:id', _sectionController.getOneData);
router.post('/create/:projectId', _sectionController.createData);
router.put('/update/:id', _sectionController.updateData);
router.delete('/delete/:id', _sectionController.deleteData);

export default router;
