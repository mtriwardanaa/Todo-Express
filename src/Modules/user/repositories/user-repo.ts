import AppDataSource from '../../../configs/connect';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UserReq } from '../interfaces/user-req';
import { UserRes } from '../interfaces/user-res';
import { UserSearch } from '../interfaces/user-search';
import { User } from '../models/user-model';
import { hashPass } from '../../../utils/bcrypt-pass';
import bcrypt from 'bcrypt';
import config from '../../../configs/config';

const getUser = async (): Promise<UserRes[] | null> => {
  const user = await AppDataSource.createQueryBuilder()
    .select('user')
    .from(User, 'user')
    .getMany();

  return user;
};

const getOneUser = async (id: string): Promise<UserRes | null> => {
  const user = await AppDataSource.createQueryBuilder()
    .select('user')
    .from(User, 'user')
    .where('user.id = :userId', { UserId: id })
    .getOne();

  return user;
};

const searchUser = async (
  params: UserSearch,
  one: boolean
): Promise<UserRes[] | UserRes | UserSearch | null> => {
  const user = AppDataSource.createQueryBuilder()
    .select('user')
    .from(User, 'user');

  Object.entries(params).forEach(([key, value], index) => {
    if (index === 0) {
      user.where(`user.${key} = :param`, { param: 'ampas' });
    } else {
      user.andWhere(`user.${key} = :param`, { param: value });
    }
  });

  return one ? user.getOne() : user.getMany();
};

const createUser = async (data: UserReq): Promise<UserRes> => {
  data.password = hashPass(data.password as string);
  const create = User.create(data);

  return create.save();
};

const updateUser = async (data: UserReq, id: string): Promise<UpdateResult> => {
  const user = await AppDataSource.createQueryBuilder()
    .update('user')
    .set(data)
    .where('id = :userId', { userId: id })
    // .where('user.id = :fserId', { userId: id })
    .execute();

  return user;
};

const deleteUser = async (id: string): Promise<DeleteResult> => {
  return User.delete(id);
};

const authUser = async (
  username: string,
  password: string
): Promise<User | null> => {
  const check = await AppDataSource.createQueryBuilder()
    .select('user')
    .from(User, 'user')
    .where('user.username = :username', { username: username })
    .getOne();

  if (!check) {
    return null;
  }

  const hashPass = check.password;
  const isPassValid = bcrypt.compareSync(
    `${password}${config.bcPass}`,
    hashPass
  );

  if (!isPassValid) {
    return null;
  }
  return check;
};

export default {
  getUser,
  getOneUser,
  searchUser,
  createUser,
  updateUser,
  deleteUser,
  authUser,
};
