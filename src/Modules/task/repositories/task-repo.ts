import AppDataSource from '../../../configs/connect';
import { SectionReq } from '../interfaces/section-req';
import { SectionRes } from '../interfaces/section-res';
import { Section } from '../models/section-model';

class TaskRepo {
  private readonly _db = AppDataSource;
  static _db: any = AppDataSource;

  getSection = async (sort: string = 'DESC', projectId: string) => {
    const section = this._db
      .createQueryBuilder()
      .select('section')
      .from(Section, 'section')
      .where('section.project_id = :projectId', { projectId: projectId })
      .orderBy('section.order', 'ASC')
      .addOrderBy('section.updated_at', sort as any);

    return section.getMany();
  };

  countSection = async (
    projectId: string
  ): Promise<SectionRes[] | number | null> => {
    const section = this._db
      .createQueryBuilder()
      .select('section')
      .from(Section, 'section')
      .where('section.project_id = :projectId', { projectId: projectId });

    return section.getCount();
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
    projectId: string
  ): Promise<SectionRes> => {
    data.order =
      ((await this.countSection(projectId)) as unknown as number) + 1;
    data.project_id = projectId;
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
    id: string,
    sectionData: Section
  ) => {
    let reorder = 0;
    let sort = 'DESC';
    Object.entries(data).forEach(async ([key, value], index) => {
      if (key === 'order') {
        reorder = 1;
        const newOrder = value;

        const oldOrder = sectionData.order;

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
      await this.reorderSection(sort, sectionData.project_id);
    }

    return section;
  };

  deleteSection = async (id: string, projectId: string) => {
    const deleteSection = await Section.delete(id);

    await this.reorderSection('DESC', projectId);

    return deleteSection;
  };

  reorderSection = async (
    sort: string = 'DESC',
    projectId: string
  ): Promise<boolean | void> => {
    const section: any = await this.getSection(sort, projectId);
    if (section) {
      section.forEach(async (value: any, index: any) => {
        await this._db
          .createQueryBuilder()
          .update('section')
          .set({ order: index + 1 })
          .where('id = :sectionId', { sectionId: value.id })
          .execute();
      });
    }
  };
}

export default TaskRepo;
