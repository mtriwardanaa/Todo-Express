import AppDataSource from '../../../configs/connect'
import { ProjectReq } from '../interfaces/project-req'
import { Project } from '../models/project-model'

class ProjectRepo {
    private readonly _db = AppDataSource
    static _db: any = AppDataSource

    getProject = async (userId: string, sort: string = 'DESC') => {
        const project = this._db
            .createQueryBuilder()
            .select('project')
            .from(Project, 'project')
            .where('project.user_id = :userId', { userId: userId })
            .orderBy('project.order', 'ASC')
            .addOrderBy('project.updated_at', sort as any)

        return project.getMany()
    }

    countProject = async (userId: string) => {
        const project = this._db
            .createQueryBuilder()
            .select('project')
            .from(Project, 'project')
            .where('project.user_id = :userId', { userId: userId })

        return project.getCount()
    }

    static async getOneProject(id: ProjectReq['id']) {
        return this._db
            .createQueryBuilder()
            .select('project')
            .from(Project, 'project')
            .where('project.id = :projectId', { projectId: id })
            .getOne()
    }

    searchProject = async (
        userId: string,
        params: ProjectReq,
        one: boolean
    ) => {
        const project = this._db
            .createQueryBuilder()
            .select('project')
            .from(Project, 'project')
            .where('project.user_id = :userId', { userId: userId })

        Object.entries(params).forEach(([key, value], index) => {
            project.andWhere(`project.${key} = :param`, { param: value })
        })

        return one ? project.getOne() : project.getMany()
    }

    createProject = async (data: Project) => {
        const create = await this._db
            .createQueryBuilder()
            .insert()
            .into(Project)
            .values(data)
            .execute()

        return create.raw[0]
    }

    updateProject = async (data: ProjectReq, dataProject: Project) => {
        const project = await this._db
            .createQueryBuilder()
            .update('project')
            .set(data)
            .where('project.id = :projectId', { projectId: dataProject.id })
            .execute()

        return project
    }

    deleteProject = async (id: string, userId: string) => {
        const deleteProject = await Project.delete(id)
        await this.reorderProject(userId)

        return deleteProject
    }

    reorderProject = async (userId: string, sort: string = 'DESC') => {
        const project: any = await this.getProject(userId, sort)

        if (project) {
            project.forEach(async (value: any, index: any) => {
                await this._db
                    .createQueryBuilder()
                    .update('project')
                    .set({ order: index + 1 })
                    .where('project.id = :projectId', { projectId: value.id })
                    .execute()
            })
        }
    }
}

export default ProjectRepo
