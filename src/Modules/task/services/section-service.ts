import { checkNull } from '../../../utils/helper';
import ProjectRepo from '../../project/repositories/project-repo';
import { SectionReq } from '../interfaces/section-req';
import { Section } from '../models/section-model';
import SectionRepo from '../repositories/section-repo';
import TaskRepo from '../repositories/task-repo';

class SectionService {
  constructor(private readonly _sectionRepo: SectionRepo) {}

  getSection = async (projectId: string) => {
    const checkData = await ProjectRepo.getOneProject(projectId);
    if (checkData == null) {
      return {
        status: false,
        message: 'project not found',
      };
    }

    const getData = await this._sectionRepo.getSection('DESC', projectId);
    return {
      status: true,
      data: getData,
    };
  };

  getOneSection = async (id: string) => {
    return SectionRepo.getOneSection(id);
  };

  createSection = async (data: Section, projectId: string) => {
    const checkData = await ProjectRepo.getOneProject(projectId);
    if (checkData == null) {
      return {
        status: false,
        message: 'project not found',
      };
    }

    const create = await this._sectionRepo.createSection(data, projectId);
    return {
      status: true,
      data: create,
    };
  };

  updateSection = async (data: SectionReq, id: string) => {
    let reOrderTask = 0;
    const checkData = await SectionRepo.getOneSection(id);
    if (checkData == null) {
      return {
        status: false,
        message: 'section not found',
      };
    }

    if (!checkNull(checkData.tasks)) {
      reOrderTask = 1;
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

    const updateData = await this._sectionRepo.updateSection(data, id);
    if (!updateData) {
      return { status: false, message: 'Update failed' };
    }

    if (reorder === 1) {
      this.orderSectionAndTask(checkData.project_id, sort);
    }

    return {
      status: true,
      data: updateData,
    };
  };

  orderSectionAndTask = async (projectid: string, sort: string) => {
    const getSection = await SectionRepo.getSectionWithTask(projectid, sort);
    if (!checkNull(getSection)) {
      await this._sectionRepo.reorderSection(getSection);
      getSection.forEach(async (value: any, index: any) => {
        const getTask = await TaskRepo.getTask(sort, projectid, value.id, null);
        if (!checkNull(getTask)) {
          await TaskRepo.reorderTask(getTask);
        }
      });
    }

    return true;
  };

  deleteSection = async (id: string) => {
    const checkData = await SectionRepo.getOneSection(id);
    if (checkNull(checkData)) {
      return {
        status: false,
        message: 'section not found',
      };
    }

    const deleteData = await this._sectionRepo.deleteSection(id);
    if (checkNull(deleteData)) {
      return {
        status: false,
        message: 'delete section failed',
      };
    }

    this.orderSectionAndTask(checkData.project_id, 'DESC');
    return {
      status: true,
      data: deleteData,
    };
  };
}

export default SectionService;
