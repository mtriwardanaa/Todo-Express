import { ProjectReq } from '../interfaces/project-req';
import { Project } from '../models/project-model';
import ProjectRepo from '../repositories/project-repo';

class ProjectService {
  constructor(private readonly _projectRepo: ProjectRepo) {}

  getProject = async (user_id: string) => {
    return this._projectRepo.getProject(user_id);
  };

  getOneProject = async (user_id: string, id: string) => {
    return this._projectRepo.getOneProject(user_id, id);
  };

  createProject = async (data: Project, user_id: string) => {
    return this._projectRepo.createProject(data, user_id);
  };

  updateProject = async (user_id: string, data: ProjectReq, id: string) => {
    return this._projectRepo.updateProject(user_id, data, id);
  };

  deleteProject = async (id: string, user_id: string) => {
    return this._projectRepo.deleteProject(id, user_id);
  };
}

export default ProjectService;
