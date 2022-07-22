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

    let dataOldSectionId = null;
    let dataOldSectionNull = '-';
    let dataNewSectionId = null;

    let dataOldParentId = null;
    let dataOldParentNull = '-';
    let dataNewParentId = null;

    let prefixOrder = 0;

    let newSectionReorder = 0;
    let newParentReorder = 0;

    const checkData = await TaskRepo.getOneTask(id);
    if (checkData == null) {
      return {
        status: false,
        message: 'task not found',
      };
    }

    if (
      !checkNull(newData.new_parent_id) &&
      !checkNull(newData.new_section_id)
    ) {
      let id = newData.new_parent_id == '-' ? null : newData.new_parent_id;
      let section_id =
        newData.new_section_id == '-' ? null : newData.new_section_id;

      const checkDataParentSection = await TaskRepo.getTaskById(
        checkData.project_id,
        section_id!,
        id!
      );

      console.log(checkDataParentSection);
      if (checkNull(checkDataParentSection)) {
        return {
          status: false,
          message: 'task with section and parent not found',
        };
      }
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

      dataOldSectionId = checkOldSection.id;
      dataOldSectionNull = checkOldSection.id;
      prefixOrder = checkOldSection.order;
    }

    if (!checkNull(newData.new_section_id)) {
      if (newData.new_section_id != dataOldSectionNull) {
        if (newData.new_section_id != '-') {
          const checkNewSection = await SectionRepo.getOneSection(
            newData.new_section_id as unknown as string
          );
          if (checkNull(checkNewSection)) {
            return {
              status: false,
              message: 'section not found',
            };
          }

          dataNewSectionId = checkNewSection.id;
          prefixOrder = checkNewSection.order;
        } else {
          newData.new_section_id = null as unknown as string;
        }

        newSectionReorder = 1;
        reorder = 1;

        newData.section_id = newData.new_section_id;
        delete newData.new_section_id;
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

      prefixOrder = checkParent.order;
      dataOldParentId = checkParent.id;
      dataOldParentNull = checkParent.id;
    }

    if (!checkNull(newData.new_parent_id)) {
      if (newData.new_parent_id == id) {
        return {
          status: false,
          message: 'parent task not available',
        };
      }

      if (newData.new_parent_id != dataOldParentNull) {
        if (newData.new_parent_id != '-') {
          const checkNewParent = await TaskRepo.getOneTask(
            newData.new_parent_id!
          );
          if (checkNull(checkNewParent)) {
            return {
              status: false,
              message: 'new parent task not found',
            };
          }

          if (!checkNull(checkNewParent.parent_id)) {
            return {
              status: false,
              message: 'parent already has parent id, not available now',
            };
          }

          prefixOrder = checkNewParent.order;
          dataNewParentId = checkNewParent.id;
        } else {
          newData.new_parent_id = null as unknown as string;
        }

        newParentReorder = 1;
        reorder = 1;

        newData.parent_id = newData.new_parent_id;
        delete newData.new_parent_id;
      }
    }

    if (!checkNull(newData.order)) {
      reorder = 1;
      newData.order = `${prefixOrder}${newData.order}`;
      const newOrder = newData.order;

      const oldOrder = checkData.order;

      if (newOrder > oldOrder) {
        sort = 'ASC';
      }
    }

    const updateData = await this._taskRepo.updateTask(newData, id);
    if (!updateData) {
      return {
        status: false,
        message: 'update failed',
      };
    }

    if (reorder === 1) {
      const task = await TaskRepo.getTask(
        sort,
        checkData.project_id,
        dataOldSectionId,
        dataOldParentId
      );

      if (!checkNull(task)) {
        await TaskRepo.reorderTask(task);
      }

      if (newSectionReorder == 1) {
        let idParentUpdate = dataOldParentId;
        if (!checkNull(newData.new_parent_id)) {
          idParentUpdate = dataNewParentId;
        }

        const task = await TaskRepo.getTask(
          sort,
          checkData.project_id,
          dataNewSectionId,
          idParentUpdate
        );

        if (!checkNull(task)) {
          await TaskRepo.reorderTask(task);
        }
      }

      if (newParentReorder == 1) {
        let idSectionUpdate = dataOldSectionId;
        if (!checkNull(newData.new_parent_id)) {
          idSectionUpdate = dataNewSectionId;
        }

        const task = await TaskRepo.getTask(
          sort,
          checkData.project_id,
          idSectionUpdate,
          dataNewParentId
        );

        if (!checkNull(task)) {
          await TaskRepo.reorderTask(task);
        }
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
