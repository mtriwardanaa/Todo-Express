import AppDataSource from '../../../configs/connect';
import { DeleteResult, UpdateResult } from 'typeorm';
import { SectionReq } from '../interfaces/section-req';
import { SectionRes } from '../interfaces/section-res';
import { Section } from '../models/section-model';
import ProjectRepo from '../../project/repositories/project-repo';

class SectionRepo {
  private readonly _db = AppDataSource;
  static _db: any = AppDataSource;

  getSection = async (
    count: boolean = false,
    sort: string = 'DESC',
    projectId: string
  ): Promise<SectionRes[] | number | null> => {
    const section = this._db
      .createQueryBuilder()
      .select('section')
      .from(Section, 'section')
      .where('section.project_id = :projectId', { projectId: projectId })
      .orderBy('section.order', 'ASC')
      .addOrderBy('section.updated_at', sort as any);

    if (count) {
      return section.getCount();
    }

    return section.getMany();
  };

  getOneSection = async (id: string) => {
    return this._db
      .createQueryBuilder()
      .select('section')
      .from(Section, 'section')
      .where('section.id = :sectionId', { sectionId: id })
      .getOne();
  };

  searchSection = async (
    params: SectionReq,
    one: boolean
  ): Promise<SectionRes[] | SectionRes | null> => {
    const section = this._db
      .createQueryBuilder()
      .select('section')
      .from(Section, 'section');

    Object.entries(params).forEach(([key, value], index) => {
      if (index === 0) {
        section.where(`section.${key} = :param`, { param: 'ampas' });
      } else {
        section.andWhere(`section.${key} = :param`, { param: value });
      }
    });

    return one ? section.getOne() : section.getMany();
  };

  createSection = async (
    data: Section,
    project_id: string
  ): Promise<SectionRes> => {
    data.order =
      ((await this.getSection(true, 'DESC', project_id)) as unknown as number) +
      1;
    data.project = await ProjectRepo.getOneProject(project_id);
    const create = await this._db
      .createQueryBuilder()
      .insert()
      .into(Section)
      .values(data)
      .execute();

    return create.raw[0];
  };

  updateSection = async (
    data: SectionReq,
    id: string
  ): Promise<UpdateResult> => {
    let reorder = 0;
    let sort = 'DESC';
    const getOne = await this.getOneSection(id);
    console.log(getOne);
    Object.entries(data).forEach(async ([key, value], index) => {
      if (key === 'order') {
        reorder = 1;
        const newOrder = value;

        const oldOrder = getOne!.order;

        if (newOrder > oldOrder) {
          sort = 'ASC';
        } else if (newOrder == oldOrder) {
          reorder = 0;
        }
      }
    });

    const section = await this._db
      .createQueryBuilder()
      .update('section')
      .set(data)
      .where('section.id = :sectionId', { sectionId: id })
      .execute();

    if (reorder === 1) {
      await this.reorderSection(sort, getOne!.project.id);
    }

    return section;
  };

  deleteSection = async (id: string): Promise<DeleteResult> => {
    const getOne = await this.getOneSection(id);
    const deleteSection = await Section.delete(id);

    await this.reorderSection('DESC', getOne!.project.id);

    return deleteSection;
  };

  reorderSection = async (
    sort: string = 'DESC',
    projectId: string
  ): Promise<boolean | void> => {
    const section: any = await this.getSection(false, sort, projectId);

    if (section) {
      section.forEach(async (value: any, index: any) => {
        await this._db
          .createQueryBuilder()
          .update('section')
          .set({ order: index + 1 })
          .where('section.id = :sectionId', { sectionId: value.id })
          .execute();
      });
    }
  };
}

export default SectionRepo;
