import AppDataSource from '../../../configs/connect';
import { DeleteResult, UpdateResult } from 'typeorm';
import { SectionReq } from '../interfaces/section-req';
import { SectionRes } from '../interfaces/section-res';
import { Section } from '../models/section-model';

class SectionRepo {
  getSection = async (
    count: boolean = false,
    sort: string = 'DESC'
  ): Promise<SectionRes[] | number | null> => {
    const section = AppDataSource.createQueryBuilder()
      .select('section')
      .from(Section, 'section')
      .orderBy('section.order', 'ASC')
      .addOrderBy('section.updated_at', sort as any);

    if (count) {
      return section.getCount();
    }

    return section.getMany();
  };

  getOneSection = async (id: string): Promise<SectionRes | null> => {
    const section = await AppDataSource.createQueryBuilder()
      .select('section')
      .from(Section, 'section')
      .where('section.id = :sectionId', { sectionId: id })
      .getOne();

    return section;
  };

  searchSection = async (
    params: SectionReq,
    one: boolean
  ): Promise<SectionRes[] | SectionRes | null> => {
    const section = AppDataSource.createQueryBuilder()
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

  createSection = async (data: SectionReq): Promise<SectionRes> => {
    data.order = ((await this.getSection(true)) as unknown as number) + 1;
    const create = await AppDataSource.createQueryBuilder()
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

    Object.entries(data).forEach(async ([key, value], index) => {
      if (key === 'order') {
        reorder = 1;
        const newOrder = value;

        const getOne = await this.getOneSection(id);
        const oldOrder = getOne!.order;

        if (newOrder > oldOrder) {
          sort = 'ASC';
        } else if (newOrder == oldOrder) {
          reorder = 0;
        }
      }
    });

    const section = await AppDataSource.createQueryBuilder()
      .update('section')
      .set(data)
      .where('section.id = :sectionId', { sectionId: id })
      .execute();

    if (reorder === 1) {
      await this.reorderSection(sort);
    }

    return section;
  };

  deleteSection = async (id: string): Promise<DeleteResult> => {
    const deleteSection = await Section.delete(id);

    await this.reorderSection();

    return deleteSection;
  };

  reorderSection = async (sort: string = 'DESC'): Promise<boolean | void> => {
    const section: any = await this.getSection(false, sort);

    if (section) {
      section.forEach(async function (value: any, index: any) {
        await AppDataSource.createQueryBuilder()
          .update('section')
          .set({ order: index + 1 })
          .where('section.id = :sectionId', { sectionId: value.id })
          .execute();
      });
    }
  };
}

export default SectionRepo;
