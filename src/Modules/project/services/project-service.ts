import { checkNull } from '../../../utils/helper';
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

    data.order =
      ((await this._projectRepo.countProject(userId)) as unknown as number) + 1;
    data.user_id = userId;

    const create = await this._projectRepo.createProject(data);
    if (checkNull(create)) {
      return {
        status: false,
        message: 'create project failed',
      };
    }

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

    let reorder = 0;
    let sort = 'DESC';

    if (!checkNull(data.order)) {
      reorder = 1;
      const newOrder = data.order;

      const oldOrder = checkData.order;

      if (newOrder > oldOrder) {
        sort = 'ASC';
      } else if (newOrder == oldOrder) {
        reorder = 0;
      }
    }

    const update = await this._projectRepo.updateProject(data, checkData);

    if (checkNull(update)) {
      return {
        status: false,
        message: 'update project failed',
      };
    }

    if (reorder === 1) {
      await this._projectRepo.reorderProject(userId, sort);
    }

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
