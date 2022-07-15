import ProjectRepo from '../../project/repositories/project-repo';
import { SectionReq } from '../interfaces/section-req';
import { Section } from '../models/section-model';
import SectionRepo from '../repositories/section-repo';

class SectionService {
  constructor(private readonly _sectionRepo: SectionRepo) {}

  getSection = async (projectId: string) => {
    const checkData = await ProjectRepo.getOneProject(projectId);
    if (checkData == null) {
      return {
        status: false,
        data: [],
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
    return this._sectionRepo.getOneSection(id);
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
    const checkData = await this._sectionRepo.getOneSection(id);
    if (checkData == null) {
      return {
        status: false,
        message: 'section not found',
      };
    }

    const updateData = await this._sectionRepo.updateSection(
      data,
      id,
      checkData
    );
    return {
      status: true,
      data: updateData,
    };
  };

  deleteSection = async (id: string) => {
    const checkData = await this._sectionRepo.getOneSection(id);
    if (checkData == null) {
      return {
        status: false,
        message: 'section not found',
      };
    }

    const deleteData = await this._sectionRepo.deleteSection(
      id,
      checkData.project_id
    );
    return {
      status: true,
      data: deleteData,
    };
  };
}

export default SectionService;
