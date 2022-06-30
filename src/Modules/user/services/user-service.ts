import { UserReq } from '../interfaces/user-req';
import UserRepo from '../repositories/user-repo';

const getUser = async () => {
  return UserRepo.getUser();
};

const createUser = async (data: UserReq) => {
  return UserRepo.createUser(data);
};

const updateUser = async (data: UserReq, id: string) => {
  return UserRepo.updateUser(data, id);
};

const deleteUser = async (id: string) => {
  return UserRepo.deleteUser(id);
};

export default { getUser, createUser, updateUser, deleteUser };
