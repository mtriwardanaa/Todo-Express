import AppDataSource from '../../../configs/connect';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ProjectReq } from '../interfaces/project-req';
import { ProjectRes } from '../interfaces/project-res';
import { Project } from '../models/project-model';

const getProject = async (
  count: boolean = false
): Promise<ProjectRes[] | number | null> => {
  const project = AppDataSource.createQueryBuilder()
    .select('project')
    .from(Project, 'project')
    .orderBy('project.order', 'ASC')
    .addOrderBy('project.updated_at', 'DESC');

  if (count) {
    return project.getCount();
  }

  return project.getMany();
};

const getOneProject = async (id: string): Promise<ProjectRes | null> => {
  const project = await AppDataSource.createQueryBuilder()
    .select('project')
    .from(Project, 'project')
    .where('project.id = :projectId', { projectId: id })
    .getOne();

  return project;
};

const searchProject = async (
  params: ProjectReq,
  one: boolean
): Promise<ProjectRes[] | ProjectRes | null> => {
  const project = AppDataSource.createQueryBuilder()
    .select('project')
    .from(Project, 'project');

  Object.entries(params).forEach(([key, value], index) => {
    if (index === 0) {
      project.where(`project.${key} = :param`, { param: 'ampas' });
    } else {
      project.andWhere(`project.${key} = :param`, { param: value });
    }
  });

  return one ? project.getOne() : project.getMany();
};

const createProject = async (data: ProjectReq): Promise<ProjectRes> => {
  data.order = ((await getProject(true)) as unknown as number) + 1;
  const create = await AppDataSource.createQueryBuilder()
    .insert()
    .into(Project)
    .values(data)
    .execute();

  return create.raw[0];
};

const updateProject = async (
  data: ProjectReq,
  id: string
): Promise<UpdateResult> => {
  const project = await AppDataSource.createQueryBuilder()
    .update('project')
    .set(data)
    .where('project.id = :projectId', { projectId: id })
    .execute();

  await reorderProject();

  return project;
};

const deleteProject = async (id: string): Promise<DeleteResult> => {
  const deleteProject = await Project.delete(id);

  await reorderProject();

  return deleteProject;
};

const reorderProject = async (): Promise<boolean | void> => {
  const project: any = await getProject();

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
