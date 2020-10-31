import { getCustomRepository } from 'typeorm';
import { compare } from 'bcryptjs';

import UserRepository from '@app/repositories/UsersRepository';
import User from '@app/entities/User';
import TokenService from '@app/services/tokenService';
import { Unauthorized } from '@app/exceptions/errors';

interface Input {
  username: string;
  password: string;
}

type AuthUser = Exclude<User, "password">

interface AuthResult {
  user: AuthUser;
  token: string;
}


class AuthenticateAction {
  async execute({ username, password }: Input): Promise<AuthResult> {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password'],
    });

    if (!user) {
      throw new Unauthorized('Your username and/or password do not match.');
    }

    const isCorrectPassword = await compare(password, user.password);

    if (!isCorrectPassword) {
      throw new Unauthorized('Your username and/or password do not match.');
    }

    const tokenService = new TokenService();
    const token = tokenService.generate(user.id);
    // @ts-ignore
    delete user.password;
    return {
      user,
      token,
    };
  }
}

export default AuthenticateAction;
