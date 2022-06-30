import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/ping', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Pong todo route' });
});

// router.get('/', getData);
// router.post('/create', createData);
// router.put('/update/:id', updateData);
// router.delete('/delete/:id', deleteData);

export default router;
