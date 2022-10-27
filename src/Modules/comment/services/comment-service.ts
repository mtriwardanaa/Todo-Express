import { checkNull } from '../../../utils/helper'
import TaskRepo from '../../task/repositories/task-repo'
import UserRepo from '../../user/repositories/user-repo'
import { CommentReq } from '../interfaces/comment-req'
import { Comment } from '../models/comment-model'
import CommentRepo from '../repositories/comment-repo'

class CommentService {
    constructor(private readonly _commentRepo: CommentRepo) {}

    getComment = async (taskId: string) => {
        const checkTask = await TaskRepo.getOneTask(taskId)
        if (!checkTask) {
            return {
                status: false,
                message: 'task not found',
            }
        }

        const getComment = await this._commentRepo.getComment(taskId)
        return {
            status: true,
            data: getComment,
        }
    }

    createComment = async (data: Comment, taskId: string, userId: string) => {
        const checkTask = await TaskRepo.getOneTask(taskId)
        if (checkNull(checkTask)) {
            return {
                status: false,
                message: 'task not found',
            }
        }

        if (!checkNull(checkTask.parent_id)) {
            return {
                status: false,
                message: 'comment on task not available',
            }
        }

        const checkUser = await UserRepo.getOneUser(userId)
        if (checkNull(checkUser)) {
            return {
                status: false,
                message: 'user not found',
            }
        }

        data.task_id = checkTask.id
        data.user_id = checkUser.id
        const create = await this._commentRepo.createComment(data)
        if (checkNull(create)) {
            return {
                status: false,
                message: 'create comment failed',
            }
        }

        return {
            status: true,
            data: create,
        }
    }

    updateComment = async (
        commentId: string,
        userId: string,
        data: CommentReq
    ) => {
        const checkComment = await CommentRepo.getOneComment(commentId, userId)
        if (checkNull(checkComment)) {
            return {
                status: false,
                message: 'comment not found',
            }
        }

        const checkUser = await UserRepo.getOneUser(userId)
        if (checkNull(checkUser)) {
            return {
                status: false,
                message: 'user not found',
            }
        }

        if (!checkNull(data.task_id)) {
            const checkTask = await TaskRepo.getOneTask(data.task_id)
            if (checkNull(checkTask)) {
                return {
                    status: false,
                    message: 'task not found',
                }
            }
        }

        const update = await this._commentRepo.updateComment(data, commentId)

        if (checkNull(update)) {
            return {
                status: false,
                message: 'update comment failed',
            }
        }

        return {
            status: true,
            data: update,
        }
    }

    deleteComment = async (commentId: string, userId: string) => {
        const checkComment = await CommentRepo.getOneComment(commentId, userId)
        if (!checkComment) {
            return {
                status: false,
                message: 'comment not found',
            }
        }

        const deleteComment = await this._commentRepo.deleteComment(commentId)
        return {
            status: true,
            data: deleteComment,
        }
    }
}

export default CommentService
