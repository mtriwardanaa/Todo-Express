import AppDataSource from '../../../configs/connect';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ProjectReq } from '../interfaces/project-req';
import { ProjectRes } from '../interfaces/project-res';
import { Project } from '../models/project-model';

const getProject = async (): Promise<ProjectRes[] | null> => {
  const project = await AppDataSource.createQueryBuilder()
    .select('project')
    .from(Project, 'project')
    .getMany();

  return project;
};

const getOneProject = async (id: string): Promise<ProjectRes | null> => {
  const project = await AppDataSource.createQueryBuilder()
    .select('project')
    .from(Project, 'project')
    .where('project.id = :projectId', { ProjectId: id })
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
    .update('projects')
    .set(data)
    .where('projects.id = :projectId', { projectId: id })
    .execute();

  return project;
};

const deleteProject = async (id: string): Promise<DeleteResult> => {
  return Project.delete(id);
};

export default {
  getProject,
  getOneProject,
  searchProject,
  createProject,
  updateProject,
  deleteProject,
};
