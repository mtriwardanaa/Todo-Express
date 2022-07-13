import { Router, Request, Response, NextFunction } from 'express';
import ProjectController from '../../Modules/project/controllers/project-controller';
import ProjectService from '../../Modules/project/services/project-service';
import ProjectRepo from '../../Modules/project/repositories/project-repo';

const router = Router();
const repository = new ProjectRepo();
const service = new ProjectService(repository);
const _projectController = new ProjectController(service);

router.get('/ping', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Pong project route' });
});

router.get('/', _projectController.getData);
router.get('/:id', _projectController.getOneData);
router.post('/create', _projectController.createData);
router.put('/update/:id', _projectController.updateData);
router.delete('/delete/:id', _projectController.deleteData);

export default router;
