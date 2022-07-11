import AppDataSource from '../../../configs/connect';
import { UserReq } from '../interfaces/user-req';
import { UserSearch } from '../interfaces/user-search';
import { User } from '../models/user-model';
import { checkHash, hashPass } from '../../../utils/bcrypt-pass';

class UserRepo {
  private readonly _db = AppDataSource;

  async getUser() {
    return this._db
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .getMany();
  }

  async getOneUser(id: UserReq['id']) {
    return this._db
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.id = :userId', { UserId: id })
      .getOne();
  }

  async searchUser(params: UserSearch, one: boolean) {
    const user = this._db
      .createQueryBuilder()
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
  }

  async createUser(data: UserReq) {
    data.password = hashPass(data.password as string);
    const create = User.create(data);

    return create.save();
  }

  async updateUser(data: UserReq, id: UserReq['id']) {
    return this._db
      .createQueryBuilder()
      .update('user')
      .set(data)
      .where('id = :userId', { userId: id })
      .execute();
  }

  async deleteUser(id: UserReq['id']) {
    return User.delete(id!);
  }

  async authUser(username: UserReq['username'], password: UserReq['password']) {
    const check = await this._db
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.username = :username', { username: username })
      .getOne();

    if (!check) {
      return null;
    }

    const hashPass = check.password;
    const isPassValid = checkHash(password!, hashPass);

    if (!isPassValid) {
      return null;
    }
    return check;
  }
}

export default UserRepo;
