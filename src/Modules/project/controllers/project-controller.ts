import { NextFunction, Request, Response } from 'express'
import ProjectService from '../services/project-service'

class ProjectController {
    constructor(private readonly _projectService: ProjectService) {}

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
            const userId = await this.authorize(req)
            const list = await this._projectService.getProject(userId)
            if (list.status) {
                res.json({
                    status: 'success',
                    data: list.data,
                    message: 'get project success',
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

    getOneData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params
            const get = await this._projectService.getOneProject(id)
            if (get != null) {
                res.json({
                    status: 'success',
                    data: get,
                    message: 'get one project success',
                })
            } else {
                res.json({
                    status: 'fail',
                    message: 'project not found',
                })
            }
        } catch (error) {
            next(error)
        }
    }

    createData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = await this.authorize(req)
            const create = await this._projectService.createProject(
                req.body,
                userId
            )
            if (create.status) {
                res.json({
                    status: 'success',
                    data: create.data,
                    message: 'create project success',
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
            const update = await this._projectService.updateProject(
                userId,
                req.body,
                req.params.id
            )
            if (update.status) {
                res.json({
                    status: 'success',
                    data: update.data,
                    message: 'update project success',
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
            const deleteProject = await this._projectService.deleteProject(
                req.params.id,
                userId
            )
            res.json({
                status: 'success',
                data: deleteProject,
                message: 'delete project success',
            })
        } catch (error) {
            next(error)
        }
    }
}

export default ProjectController
