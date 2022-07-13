import { SectionReq } from '../interfaces/section-req';
import { Section } from '../models/section-model';
import SectionRepo from '../repositories/section-repo';

class SectionService {
  constructor(private readonly _sectionRepo: SectionRepo) {}

  getSection = async (projectId: string) => {
    return this._sectionRepo.getSection(false, 'DESC', projectId);
  };

  getOneSection = async (id: string) => {
    return this._sectionRepo.getOneSection(id);
  };

  createSection = async (data: Section, project_id: string) => {
    return this._sectionRepo.createSection(data, project_id);
  };

  updateSection = async (data: SectionReq, id: string) => {
    return this._sectionRepo.updateSection(data, id);
  };

  deleteSection = async (id: string) => {
    return this._sectionRepo.deleteSection(id);
  };
}

export default SectionService;
