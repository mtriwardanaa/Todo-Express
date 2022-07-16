import AppDataSource from '../../../configs/connect';
import { ProjectReq } from '../interfaces/project-req';
import { Project } from '../models/project-model';

class ProjectRepo {
  private readonly _db = AppDataSource;
  static _db: any = AppDataSource;

  getProject = async (userId: string, sort: string = 'DESC') => {
    const project = this._db
      .createQueryBuilder()
      .select('project')
      .from(Project, 'project')
      .where('project.user_id = :userId', { userId: userId })
      .orderBy('project.order', 'ASC')
      .addOrderBy('project.updated_at', sort as any);

    return project.getMany();
  };

  countProject = async (userId: string) => {
    const project = this._db
      .createQueryBuilder()
      .select('project')
      .from(Project, 'project')
      .where('project.user_id = :userId', { userId: userId });

    return project.getCount();
  };

  static async getOneProject(id: ProjectReq['id']) {
    return this._db
      .createQueryBuilder()
      .select('project')
      .from(Project, 'project')
      .where('project.id = :projectId', { projectId: id })
      .getOne();
  }

  searchProject = async (userId: string, params: ProjectReq, one: boolean) => {
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

  createProject = async (data: Project, userId: string) => {
    data.order = ((await this.countProject(userId)) as unknown as number) + 1;
    const create = await this._db
      .createQueryBuilder()
      .insert()
      .into(Project)
      .values(data)
      .execute();

    return create.raw[0];
  };

  updateProject = async (
    userId: string,
    data: ProjectReq,
    dataProject: Project
  ) => {
    let reorder = 0;
    let sort = 'DESC';
    Object.entries(data).forEach(async ([key, value], index) => {
      if (key === 'order') {
        reorder = 1;
        const newOrder = value;

        const oldOrder = dataProject.order;

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
      .where('project.id = :projectId', { projectId: dataProject.id })
      .execute();

    if (reorder === 1) {
      await this.reorderProject(userId, sort);
    }

    return project;
  };

  deleteProject = async (id: string, userId: string) => {
    const deleteProject = await Project.delete(id);
    console.log(deleteProject);
    await this.reorderProject(userId);

    return deleteProject;
  };

  reorderProject = async (userId: string, sort: string = 'DESC') => {
    const project: any = await this.getProject(userId, sort);

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
