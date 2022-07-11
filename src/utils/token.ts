import config from '../configs/config';
import jwt from 'jsonwebtoken';
import { UserRes } from '../Modules/user/interfaces/user-res';

export const signToken = (data: UserRes) => {
  const token = jwt.sign(
    { user: data },
    config.tokenSecret as unknown as string
  );
  return token;
};

export const checkUser = (token: string) => {
  return jwt.verify(token, config.tokenSecret as unknown as string);
};
