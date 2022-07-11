import AppDataSource from '../../../configs/connect';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ProjectReq } from '../interfaces/project-req';
import { ProjectRes } from '../interfaces/project-res';
import { Project } from '../models/project-model';
import { JwtPayload } from 'jsonwebtoken';
import { checkUser } from '../../../utils/token';

const getProject = async (
  token: string,
  count: boolean = false,
  sort: string = 'DESC'
): Promise<ProjectRes[] | number | null> => {
  const { user } = checkUser(token) as JwtPayload;
  const userId = user.id;
  const project = AppDataSource.createQueryBuilder()
    .select('project')
    .from(Project, 'project')
    .orderBy('project.order', 'ASC')
    .where('project.user_id = :userId', { userId: userId })
    .addOrderBy('project.updated_at', sort as any);

  if (count) {
    return project.getCount();
  }

  return project.getMany();
};

const getOneProject = async (
  token: string,
  id: string
): Promise<ProjectRes | null> => {
  const { user } = checkUser(token) as JwtPayload;
  const userId = user.id;
  const project = await AppDataSource.createQueryBuilder()
    .select('project')
    .from(Project, 'project')
    .where('project.id = :projectId', { projectId: id })
    .andWhere('project.user_id = :userId', { userId: userId })
    .getOne();

  return project;
};

const searchProject = async (
  token: string,
  params: ProjectReq,
  one: boolean
): Promise<ProjectRes[] | ProjectRes | null> => {
  const { user } = checkUser(token) as JwtPayload;
  const userId = user.id;
  const project = AppDataSource.createQueryBuilder()
    .select('project')
    .from(Project, 'project')
    .where('project.user_id = :userId', { userId: userId });

  Object.entries(params).forEach(([key, value], index) => {
    project.andWhere(`project.${key} = :param`, { param: value });
  });

  return one ? project.getOne() : project.getMany();
};

const createProject = async (
  data: Project,
  token: string
): Promise<ProjectRes> => {
  data.order = ((await getProject(token, true)) as unknown as number) + 1;
  const { user } = checkUser(token) as JwtPayload;
  data.user = user;
  const create = await AppDataSource.createQueryBuilder()
    .insert()
    .into(Project)
    .values(data)
    .execute();

  return create.raw[0];
};

const updateProject = async (
  token: string,
  data: ProjectReq,
  id: string
): Promise<UpdateResult> => {
  let reorder = 0;
  let sort = 'DESC';

  Object.entries(data).forEach(async ([key, value], index) => {
    if (key === 'order') {
      reorder = 1;
      const newOrder = value;

      const getOne = await getOneProject(token, id);
      const oldOrder = getOne!.order;

      if (newOrder > oldOrder) {
        sort = 'ASC';
      } else if (newOrder == oldOrder) {
        reorder = 0;
      }
    }
  });

  const project = await AppDataSource.createQueryBuilder()
    .update('project')
    .set(data)
    .where('project.id = :projectId', { projectId: id })
    .execute();

  if (reorder === 1) {
    await reorderProject(sort);
  }

  return project;
};

const deleteProject = async (
  id: string,
  token: string
): Promise<DeleteResult> => {
  const deleteProject = await Project.delete(id);

  await reorderProject(token);

  return deleteProject;
};

const reorderProject = async (
  token: string,
  sort: string = 'DESC'
): Promise<boolean | void> => {
  const project: any = await getProject(token, false, sort);

  if (project) {
    project.forEach(async function (value: any, index: any) {
      await AppDataSource.createQueryBuilder()
        .update('project')
        .set({ order: index + 1 })
        .where('project.id = :projectId', { projectId: value.id })
        .execute();
    });
  }
};

export default {
  getProject,
  getOneProject,
  searchProject,
  createProject,
  updateProject,
  deleteProject,
};
