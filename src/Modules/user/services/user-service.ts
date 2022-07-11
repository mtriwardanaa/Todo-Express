import { UserReq } from '../interfaces/user-req';
import UserRepo from '../repositories/user-repo';
import { signToken } from '../../../utils/token';

export class UserService {
  constructor(private readonly _userRepo: UserRepo) {}

  async getUser() {
    return this._userRepo.getUser();
  }

  async createUser(data: UserReq) {
    return this._userRepo.createUser(data);
  }

  async updateUser(data: UserReq, id: UserReq['id']) {
    return this._userRepo.updateUser(data, id);
  }

  async deleteUser(id: UserReq['id']) {
    return this._userRepo.deleteUser(id);
  }

  async login(username: UserReq['username'], password: UserReq['password']) {
    const check = await this._userRepo.authUser(username, password);
    if (!check) {
      return false;
    }

    const token = signToken(check);
    return {
      ...check,
      token: token,
    };
  }
}

export default UserService;
