import { checkNull, generateSubtask } from '../../../utils/helper';
import ProjectRepo from '../../project/repositories/project-repo';
import { TaskReq } from '../interfaces/task-req';
import { Task } from '../models/task-model';
import SectionRepo from '../repositories/section-repo';
import TaskRepo from '../repositories/task-repo';

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

    const getTaskNullSection = await TaskRepo.getTask(
      'DESC',
      projectId,
      null,
      null
    );
    const getTaskWithSection = await SectionRepo.getSectionWithTask(projectId);
    return {
      status: true,
      dataNoSection: getTaskNullSection,
      dataWithSection: getTaskWithSection,
    };
  };

  getOneTask = async (id: string) => {
    return TaskRepo.getOneTask(id);
  };

  createTask = async (dataReq: Task, projectId: string) => {
    let sectionOrder = 0;
    let sectionId = null;
    let parentId = null;

    const checkProject = await ProjectRepo.getOneProject(projectId);
    if (checkNull(checkProject)) {
      return {
        status: false,
        message: 'project not found',
      };
    }

    if (!checkNull(dataReq.section_id)) {
      const checkSection = await SectionRepo.getOneSection(dataReq.section_id);
      if (checkSection) {
        sectionOrder = checkSection.order;
        sectionId = checkSection.id;
      }
    }

    if (!checkNull(dataReq.parent_id)) {
      const checkParent = await TaskRepo.getOneTask(dataReq.parent_id);
      if (checkNull(checkParent)) {
        return {
          status: false,
          message: 'parent task not found',
        };
      }

      if (!checkNull(checkParent.parent_id)) {
        return {
          status: false,
          message: 'parent already has parent id, not available now',
        };
      }

      sectionOrder = checkParent.order;
      parentId = checkParent.id;
      sectionId = checkParent.section_id;
      dataReq.section_id = checkParent.section_id;
    }

    const countTask = (await TaskRepo.countTask(
      projectId,
      sectionId,
      parentId
    )) as unknown as number;
    const order = ((countTask as unknown as number) + 1) as unknown as string;

    console.log(countTask, sectionId, parentId);
    dataReq.order = `${sectionOrder}${order}`;
    dataReq.project_id = projectId;

    const create = await this._taskRepo.createTask(dataReq);
    if (checkNull(create)) {
      return {
        status: false,
        message: 'create task failed',
      };
    }

    return {
      status: true,
      data: create,
    };
  };

  updateTask = async (newData: TaskReq, id: string) => {
    let sort = 'DESC';
    let reorder = 0;
    let reorderbySection = 0;
    let newSectionReorder = 0;
    let sectionOrder = 0;
    let parentId = null;
    let dataNewSection = null;
    let dataOldSection = null;

    const checkData = await TaskRepo.getOneTask(id);
    if (checkData == null) {
      return {
        status: false,
        message: 'task not found',
      };
    }

    if (!checkNull(checkData.section_id)) {
      const checkOldSection = await SectionRepo.getOneSection(
        checkData.section_id as unknown as string
      );
      if (checkNull(checkOldSection)) {
        return {
          status: false,
          message: 'old section not found',
        };
      }

      dataOldSection = checkOldSection;
      sectionOrder = checkOldSection.order;
    }

    if (!checkNull(newData.new_section_id)) {
      if (newData.new_section_id != checkData.section_id) {
        const checkNewSection = await SectionRepo.getOneSection(
          newData.new_section_id as unknown as string
        );
        if (checkNull(checkNewSection)) {
          return {
            status: false,
            message: 'section not found',
          };
        }

        dataNewSection = checkNewSection;

        sectionOrder = checkNewSection.order;
        if (newData.new_section_id != checkData.section_id) {
          newSectionReorder = 1;
          reorderbySection = 1;

          newData.section_id = newData.new_section_id;
          delete newData.new_section_id;
        }
      }
    }

    if (!checkNull(checkData.parent_id)) {
      const checkParent = await TaskRepo.getOneTask(checkData.parent_id);
      if (checkNull(checkParent)) {
        return {
          status: false,
          message: 'parent task not found',
        };
      }

      sectionOrder = checkParent.order;
      parentId = checkParent.id;
    }

    if (!checkNull(newData.order)) {
      reorder = 1;
      newData.order = `${sectionOrder}${newData.order}`;
      const newOrder = newData.order;

      const oldOrder = checkData.order;

      if (newOrder > oldOrder) {
        sort = 'ASC';
      } else if (newOrder == oldOrder) {
        reorder = 0;
      }
    }

    const updateData = await this._taskRepo.updateTask(newData, id);
    if (!updateData) {
      return {
        status: false,
        message: 'update failed',
      };
    }

    if (reorder === 1 || reorderbySection === 1) {
      let dataOldSectionId = null;
      if (!checkNull(dataOldSection)) {
        dataOldSectionId = dataOldSection.id;
      }

      const task = await TaskRepo.getTask(
        sort,
        checkData.project_id,
        dataOldSectionId,
        parentId
      );

      console.log(task);
      if (!checkNull(task)) {
        await TaskRepo.reorderTask(task);
      }

      if (newSectionReorder == 1) {
        // await TaskRepo.reorderTask(
        //   sort,
        //   checkData.project_id,
        //   dataNewSection.id,
        //   null
        // );
      }
    }

    return {
      status: true,
      data: updateData,
    };
  };

  deleteTask = async (id: string) => {
    const checkData = await TaskRepo.getOneTask(id);
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
