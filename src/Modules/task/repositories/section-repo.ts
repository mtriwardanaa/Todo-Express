import { IsNull } from 'typeorm'
import AppDataSource from '../../../configs/connect'
import { SectionReq } from '../interfaces/section-req'
import { Section } from '../models/section-model'

class SectionRepo {
    private readonly _db = AppDataSource
    static _db: any = AppDataSource

    getSection = async (sort: string = 'DESC', projectId: string) => {
        const section = this._db
            .createQueryBuilder()
            .select('section')
            .from(Section, 'section')
            .where('section.project_id = :projectId', { projectId: projectId })
            .orderBy('section.order', 'ASC')
            .addOrderBy('section.updated_at', sort as any)

        return section.getMany()
    }

    static getSectionWithTask = async (
        projectId: string,
        sort: string = 'DESC'
    ) => {
        return this._db
            .getRepository(Section)
            .createQueryBuilder('section')
            .leftJoinAndSelect('section.tasks', 'tasks')
            .leftJoinAndSelect('tasks.subtasks', 'subtasks')
            .leftJoinAndSelect('tasks.comments', 'comments')
            .where('section.project_id = :projectId', { projectId })
            .andWhere('tasks.parent_id IS NULL')
            .orderBy('section.order', 'ASC')
            .addOrderBy('section.updated_at', sort)
            .addOrderBy('tasks.order', 'ASC')
            .addOrderBy('subtasks.order', 'ASC')
            .getMany()
    }

    countSection = async (projectId: string) => {
        const section = this._db
            .createQueryBuilder()
            .select('section')
            .from(Section, 'section')
            .where('section.project_id = :projectId', { projectId: projectId })

        return section.getCount()
    }

    static getOneSection = async (id: string) => {
        return this._db
            .getRepository(Section)
            .createQueryBuilder('section')
            .leftJoinAndSelect('section.tasks', 'tasks')
            .where('section.id = :sectionId', { sectionId: id })
            .getOne()
    }

    searchSection = async (params: SectionReq, one: boolean) => {
        const section = this._db
            .createQueryBuilder()
            .select('section')
            .from(Section, 'section')

        Object.entries(params).forEach(([key, value], index) => {
            if (index === 0) {
                section.where(`section.${key} = :param`, { param: 'ampas' })
            } else {
                section.andWhere(`section.${key} = :param`, { param: value })
            }
        })

        return one ? section.getOne() : section.getMany()
    }

    createSection = async (data: Section, projectId: string) => {
        data.order =
            ((await this.countSection(projectId)) as unknown as number) + 1
        data.project_id = projectId
        const create = await this._db
            .createQueryBuilder()
            .insert()
            .into(Section)
            .values(data)
            .execute()

        return create.raw[0]
    }

    updateSection = async (data: SectionReq, id: string) => {
        const section = await this._db
            .createQueryBuilder()
            .update('section')
            .set(data)
            .where('section.id = :sectionId', { sectionId: id })
            .execute()

        return section
    }

    deleteSection = async (id: string) => {
        const deleteSection = await Section.delete(id)

        return deleteSection
    }

    reorderSection = async (sectionData: any) => {
        if (sectionData) {
            sectionData.forEach(async (value: any, index: any) => {
                await this._db
                    .createQueryBuilder()
                    .update('section')
                    .set({ order: index + 1 })
                    .where('id = :sectionId', { sectionId: value.id })
                    .execute()
            })
        }
    }
}

export default SectionRepo
