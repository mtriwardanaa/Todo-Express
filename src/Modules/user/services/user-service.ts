import { UserReq } from '../interfaces/user-req';
import UserRepo from '../repositories/user-repo';
import jwt from 'jsonwebtoken';
import config from '../../../configs/config';

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

const login = async (username: string, password: string) => {
  const check = await UserRepo.authUser(username, password);
  if (!check) {
    return false;
  }

  const token = jwt.sign({ check }, config.tokenSecret as unknown as string);
  return {
    ...check,
    token: token,
  };
};

export default { getUser, createUser, updateUser, deleteUser, login };
