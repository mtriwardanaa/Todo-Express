import { UserReq } from '../interfaces/user-req';
import UserRepo from '../repositories/user-repo';
import { signToken } from '../../../utils/token';

class UserService {
  constructor(private readonly _userRepo: UserRepo) {}

  async getUser() {
    return this._userRepo.getUser();
  }

  async getOneUser(id: string) {
    return UserRepo.getOneUser(id);
  }

  async createUser(data: UserReq) {
    return this._userRepo.createUser(data);
  }

  async updateUser(data: UserReq, id: UserReq['id']) {
    const checkUser = await UserRepo.getOneUser(id);
    if (!checkUser) {
      return {
        status: false,
        message: 'user not found',
      };
    }

    const update = await this._userRepo.updateUser(data, id);
    return {
      status: true,
      data: update,
    };
  }

  async deleteUser(id: UserReq['id']) {
    const checkUser = await UserRepo.getOneUser(id);
    if (!checkUser) {
      return {
        status: false,
        message: 'user not found',
      };
    }

    const deleteUser = await this._userRepo.deleteUser(id);
    return {
      status: true,
      data: deleteUser,
    };
  }

  async login(username: UserReq['username'], password: UserReq['password']) {
    const check = await this._userRepo.authUser(username, password);
    if (!check) {
      return {
        status: false,
        message: 'User not found',
      };
    }

    const token = await signToken(check);
    if (!token) {
      return {
        status: false,
        message: 'Token failed',
      };
    }
    return {
      status: true,
      ...check,
      token: token,
    };
  }
}

export default UserService;
