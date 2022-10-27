import AppDataSource from '../../../configs/connect'
import { checkNull } from '../../../utils/helper'
import { CommentReq } from '../interfaces/comment-req'
import { Comment } from '../models/comment-model'

class CommentRepo {
    private readonly _db = AppDataSource
    static _db: any = AppDataSource

    getComment = async (taskId: string) => {
        const comment = this._db
            .createQueryBuilder()
            .select('comment')
            .from(Comment, 'comment')
            .where('comment.task_id = :taskId', { taskId })
            .addOrderBy('comment.created_at', 'DESC')

        return comment.getMany()
    }

    static async getOneComment(
        commentId: CommentReq['id'],
        userId: string | null = null
    ) {
        const comment = this._db
            .createQueryBuilder()
            .select('comment')
            .from(Comment, 'comment')
            .where('comment.id = :commentId', { commentId })

        if (!checkNull(userId)) {
            comment.andWhere('comment.user_id = :userId', { userId })
        } else {
            comment.andWhere('comment.user_id IS NULL')
        }
        return comment.getOne()
    }

    createComment = async (data: Comment) => {
        const create = await this._db
            .createQueryBuilder()
            .insert()
            .into(Comment)
            .values(data)
            .execute()

        return create.raw[0]
    }

    updateComment = async (data: CommentReq, commentId: string) => {
        const comment = await this._db
            .createQueryBuilder()
            .update('comment')
            .set(data)
            .where('comment.id = :commentId', { commentId })
            .execute()

        return comment
    }

    deleteComment = async (commentId: string) => {
        return Comment.delete(commentId)
    }
}

export default CommentRepo
