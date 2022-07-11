import { ProjectReq } from '../interfaces/project-req';
import { Project } from '../models/project-model';
import ProjectRepo from '../repositories/project-repo';

const getProject = async (token: string) => {
  return ProjectRepo.getProject(token);
};

const getOneProject = async (token: string, id: string) => {
  return ProjectRepo.getOneProject(token, id);
};

const createProject = async (data: Project, token: string) => {
  return ProjectRepo.createProject(data, token);
};

const updateProject = async (token: string, data: ProjectReq, id: string) => {
  return ProjectRepo.updateProject(token, data, id);
};

const deleteProject = async (id: string, token: string) => {
  return ProjectRepo.deleteProject(id, token);
};

export default {
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getOneProject,
};
