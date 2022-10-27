import { Router, Request, Response, NextFunction } from 'express'
import CommentController from '../../Modules/comment/controllers/comment-controller'
import CommentService from '../../Modules/comment/services/comment-service'
import CommentRepo from '../../Modules/comment/repositories/comment-repo'

const router = Router()
const repository = new CommentRepo()
const service = new CommentService(repository)
const _commentController = new CommentController(service)

router.get('/ping', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: 'Pong comment route' })
})

router.get('/:taskId', _commentController.getData)
router.post('/create/:taskId', _commentController.createData)
router.put('/update/:commentId', _commentController.updateData)
router.delete('/delete/:commentId', _commentController.deleteData)

export default router
