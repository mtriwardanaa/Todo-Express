import ProjectRepo from '../../project/repositories/project-repo';
import { SectionRes } from '../interfaces/section-res';
import { TaskReq } from '../interfaces/task-req';
import { Task } from '../models/task-model';
import TaskRepo from '../repositories/task-repo';

interface NameInterface {
  [key: string]: Task[];
}

class TaskService {
  constructor(private readonly _taskRepo: TaskRepo) {}

  getTask = async (projectId: string) => {
    const checkData = await ProjectRepo.getOneProject(projectId);
    if (checkData == null) {
      return {
        status: false,
        message: 'project not found',
      };
    }

    const getData = await this._taskRepo.getTask('DESC', projectId);

    const subtask = await this.generateSubtask(getData);
    const sect = await this.generateSection(subtask);
    console.log(sect);
    return {
      status: true,
      data: sect,
    };
  };

  generateSubtask = async (arr: Task[], parent = null) => {
    let data: any[] = [];
    arr.forEach(async (value: any, index: any) => {
      if (value.parent_id == parent) {
        value.subtasks = await this.generateSubtask(arr, value.id);
        data.push(value);
      }
    });
    return data;
  };

  generateSection = async (arr: Task[], section_id = null) => {
    return arr.reduce((group: NameInterface, value) => {
      let ampas = 'ampas';
      if (value.section_id != null) {
        ampas = value.section.name;
      }
      group[ampas] = group[ampas] ?? [];
      group[ampas].push(value);
      return group;
    }, {});
  };

  getOneTask = async (id: string) => {
    return this._taskRepo.getOneTask(id);
  };

  createTask = async (data: Task, projectId: string) => {
    const checkData = await ProjectRepo.getOneProject(projectId);
    if (checkData == null) {
      return {
        status: false,
        message: 'project not found',
      };
    }

    const create = await this._taskRepo.createTask(data, projectId);
    return {
      status: true,
      data: create,
    };
  };

  updateTask = async (data: TaskReq, id: string) => {
    const checkData = await this._taskRepo.getOneTask(id);
    if (checkData == null) {
      return {
        status: false,
        message: 'task not found',
      };
    }

    const updateData = await this._taskRepo.updateTask(data, id, checkData);
    return {
      status: true,
      data: updateData,
    };
  };

  deleteTask = async (id: string) => {
    const checkData = await this._taskRepo.getOneTask(id);
    if (checkData == null) {
      return {
        status: false,
        message: 'task not found',
      };
    }

    const deleteData = await this._taskRepo.deleteTask(
      id,
      checkData.project_id
    );
    return {
      status: true,
      data: deleteData,
    };
  };
}

export default TaskService;
