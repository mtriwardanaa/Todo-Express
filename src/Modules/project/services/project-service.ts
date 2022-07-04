import { ProjectReq } from '../interfaces/project-req';
import ProjectRepo from '../repositories/project-repo';

const getProject = async () => {
  return ProjectRepo.getProject();
};

const createProject = async (data: ProjectReq) => {
  return ProjectRepo.createProject(data);
};

const updateProject = async (data: ProjectReq, id: string) => {
  return ProjectRepo.updateProject(data, id);
};

const deleteProject = async (id: string) => {
  return ProjectRepo.deleteProject(id);
};

export default { getProject, createProject, updateProject, deleteProject };
