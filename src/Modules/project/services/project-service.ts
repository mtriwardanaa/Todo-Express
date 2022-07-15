import UserRepo from '../../user/repositories/user-repo';
import { ProjectReq } from '../interfaces/project-req';
import { Project } from '../models/project-model';
import ProjectRepo from '../repositories/project-repo';

class ProjectService {
  constructor(private readonly _projectRepo: ProjectRepo) {}

  getProject = async (userId: string) => {
    const checkUser = await UserRepo.getOneUser(userId);
    if (!checkUser) {
      return {
        status: false,
        message: 'user not found',
      };
    }

    const getProject = await this._projectRepo.getProject(userId);
    return {
      status: true,
      data: getProject,
    };
  };

  getOneProject = async (id: string) => {
    return ProjectRepo.getOneProject(id);
  };

  createProject = async (data: Project, userId: string) => {
    const checkUser = await UserRepo.getOneUser(userId);
    if (!checkUser) {
      return {
        status: false,
        message: 'user not found',
      };
    }

    const create = await this._projectRepo.createProject(data, userId);
    return {
      status: true,
      data: create,
    };
  };

  updateProject = async (userId: string, data: ProjectReq, id: string) => {
    const checkUser = await UserRepo.getOneUser(userId);
    if (!checkUser) {
      return {
        status: false,
        message: 'user not found',
      };
    }

    const checkData = await ProjectRepo.getOneProject(id);
    if (!checkData) {
      return {
        status: false,
        message: 'project not found',
      };
    }

    const update = await this._projectRepo.updateProject(
      userId,
      data,
      checkData
    );

    return {
      status: true,
      data: update,
    };
  };

  deleteProject = async (id: string, userId: string) => {
    const checkUser = await UserRepo.getOneUser(userId);
    if (!checkUser) {
      return {
        status: false,
        message: 'user not found',
      };
    }

    const deleteProject = await this._projectRepo.deleteProject(id, userId);
    return {
      status: true,
      data: deleteProject,
    };
  };
}

export default ProjectService;
