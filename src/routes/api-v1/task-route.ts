import { Router, Request, Response, NextFunction } from 'express';
import TaskController from '../../Modules/task/controllers/task-controller';
import TaskService from '../../Modules/task/services/task-service';
import TaskRepo from '../../Modules/task/repositories/task-repo';

const router = Router();
const repository = new TaskRepo();
const service = new TaskService(repository);
const _taskController = new TaskController(service);

router.get('/ping', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Pong task route' });
});

router.get('/project/:projectId', _taskController.getData);
router.get('/:id', _taskController.getOneData);
router.post('/create/:projectId', _taskController.createData);
router.put('/update/:id', _taskController.updateData);
router.delete('/delete/:id', _taskController.deleteData);

export default router;
