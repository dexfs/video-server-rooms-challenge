import { getCustomRepository } from 'typeorm';
import { compare } from 'bcryptjs';

import UserRepository from '@app/repositories/UsersRepository';
import User from '@app/entities/User';
import TokenService from '@app/services/tokenService';
import { Unauthorized } from '@app/exceptions/errors';
import AbstractAction from './ActionAbstract';

interface Input {
  username: string;
  password: string;
}

type AuthUser = Exclude<User, "password">

interface AuthResult {
  token: string;
}


class AuthenticateAction extends AbstractAction{
  async execute({ username, password }: Input): Promise<AuthResult> {
    const {userRepository} = this.loadRepositories();
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
    const token = tokenService.generate(user);
    return {
      token,
    };
  }
  loadRepositories() {
    return {
      userRepository: getCustomRepository(UserRepository)
    }
  }
}

export default AuthenticateAction;
