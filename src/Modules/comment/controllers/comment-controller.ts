import { NextFunction, Request, Response } from 'express'
import CommentService from '../services/comment-service'

class CommentController {
    constructor(private readonly _commentService: CommentService) {}

    authorize = async (req: Request) => {
        const header = req.headers.authorization
        if (!header) {
            return ''
        }

        const payload = JSON.parse(
            Buffer.from(header.split('.')[1], 'base64').toString()
        )
        return payload.user.id
    }

    getData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { taskId } = req.params
            const list = await this._commentService.getComment(taskId)
            if (list.status) {
                res.json({
                    status: 'success',
                    data: list.data,
                    message: 'get comment success',
                })
            } else {
                res.json({
                    status: 'fail',
                    message: list.message,
                })
            }
        } catch (error) {
            next(error)
        }
    }

    createData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = await this.authorize(req)
            const { taskId } = req.params
            const create = await this._commentService.createComment(
                req.body,
                taskId,
                userId
            )

            if (create.status) {
                res.json({
                    status: 'success',
                    data: create.data,
                    message: 'create comment success',
                })
            } else {
                res.json({
                    status: 'fail',
                    message: create.message,
                })
            }
        } catch (error) {
            next(error)
        }
    }

    updateData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = await this.authorize(req)
            const { commentId } = req.params
            const update = await this._commentService.updateComment(
                commentId,
                userId,
                req.body
            )

            if (update.status) {
                res.json({
                    status: 'success',
                    data: update.data,
                    message: 'update comment success',
                })
            } else {
                res.json({
                    status: 'fail',
                    message: update.message,
                })
            }
        } catch (error) {
            next(error)
        }
    }

    deleteData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = await this.authorize(req)
            const { commentId } = req.params
            const deleteComment = await this._commentService.deleteComment(
                commentId,
                userId
            )
            res.json({
                status: 'success',
                data: deleteComment,
                message: 'delete comment success',
            })
        } catch (error) {
            next(error)
        }
    }
}

export default CommentController
