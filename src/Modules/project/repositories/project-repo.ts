import AppDataSource from '../../../configs/connect';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ProjectReq } from '../interfaces/project-req';
import { ProjectRes } from '../interfaces/project-res';
import { Project } from '../models/project-model';
import UserRepo from '../../user/repositories/user-repo';

class ProjectRepo {
  private readonly _db = AppDataSource;

  getProject = async (
    user_id: string,
    count: boolean = false,
    sort: string = 'DESC'
  ): Promise<ProjectRes[] | number | null> => {
    const userId = user_id;
    const project = this._db
      .createQueryBuilder()
      .select('project')
      .from(Project, 'project')
      .where('project.user_id = :userId', { userId: userId })
      .orderBy('project.order', 'ASC')
      .addOrderBy('project.updated_at', sort as any);

    if (count) {
      return project.getCount();
    }

    return project.getMany();
  };

  getOneProject = async (
    user_id: string,
    id: string
  ): Promise<ProjectRes | null> => {
    const userId = user_id;
    const project = await this._db
      .createQueryBuilder()
      .select('project')
      .from(Project, 'project')
      .where('project.id = :projectId', { projectId: id })
      .andWhere('project.user_id = :userId', { userId: userId })
      .getOne();

    return project;
  };

  searchProject = async (
    user_id: string,
    params: ProjectReq,
    one: boolean
  ): Promise<ProjectRes[] | ProjectRes | null> => {
    const userId = user_id;
    const project = this._db
      .createQueryBuilder()
      .select('project')
      .from(Project, 'project')
      .where('project.user_id = :userId', { userId: userId });

    Object.entries(params).forEach(([key, value], index) => {
      project.andWhere(`project.${key} = :param`, { param: value });
    });

    return one ? project.getOne() : project.getMany();
  };

  createProject = async (
    data: Project,
    user_id: string
  ): Promise<ProjectRes> => {
    data.order =
      ((await this.getProject(user_id, true)) as unknown as number) + 1;
    data.user = await UserRepo.getOneUser(user_id);
    const create = await this._db
      .createQueryBuilder()
      .insert()
      .into(Project)
      .values(data)
      .execute();

    return create.raw[0];
  };

  updateProject = async (
    user_id: string,
    data: ProjectReq,
    id: string
  ): Promise<UpdateResult> => {
    let reorder = 0;
    let sort = 'DESC';
    Object.entries(data).forEach(async ([key, value], index) => {
      if (key === 'order') {
        reorder = 1;
        const newOrder = value;

        const getOne = await this.getOneProject(user_id, id);
        const oldOrder = getOne!.order;

        if (newOrder > oldOrder) {
          sort = 'ASC';
        } else if (newOrder == oldOrder) {
          reorder = 0;
        }
      }
    });

    const project = await this._db
      .createQueryBuilder()
      .update('project')
      .set(data)
      .where('project.id = :projectId', { projectId: id })
      .execute();

    if (reorder === 1) {
      await this.reorderProject(user_id, sort);
    }

    return project;
  };

  deleteProject = async (
    id: string,
    user_id: string
  ): Promise<DeleteResult> => {
    const deleteProject = await Project.delete(id);

    await this.reorderProject(user_id);

    return deleteProject;
  };

  reorderProject = async (
    user_id: string,
    sort: string = 'DESC'
  ): Promise<boolean | void> => {
    const project: any = await this.getProject(user_id, false, sort);

    if (project) {
      project.forEach(async (value: any, index: any) => {
        await this._db
          .createQueryBuilder()
          .update('project')
          .set({ order: index + 1 })
          .where('project.id = :projectId', { projectId: value.id })
          .execute();
      });
    }
  };
}

export default ProjectRepo;
