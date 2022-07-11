import { SectionReq } from '../interfaces/section-req';
import SectionRepo from '../repositories/section-repo';

const getSection = async () => {
  return SectionRepo.getSection();
};

const getOneSection = async (id: string) => {
  return SectionRepo.getOneSection(id);
};

const createSection = async (data: SectionReq) => {
  return SectionRepo.createSection(data);
};

const updateSection = async (data: SectionReq, id: string) => {
  return SectionRepo.updateSection(data, id);
};

const deleteSection = async (id: string) => {
  return SectionRepo.deleteSection(id);
};

export default {
  getSection,
  createSection,
  updateSection,
  deleteSection,
  getOneSection,
};
