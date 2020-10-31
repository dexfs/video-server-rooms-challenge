import { getCustomRepository } from 'typeorm';
import { compare } from 'bcryptjs';

import UserRepository from '@app/repositories/UsersRepository';
import User from '@app/entities/User';
import TokenService from '@app/services/tokenService';
import { Unauthorized } from '@shared/utils/errors';

interface Input {
  username: string;
  password: string;
}


interface AuthResult {
  user: User;
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

    const userPassword = user.password || '';
    const isCorrectPassword = await compare(password, userPassword);
    delete user.password;

    if (!isCorrectPassword) {
      throw new Unauthorized('Your username and/or password do not match.');
    }

    const tokenService = new TokenService();
    const token = tokenService.generate(user.id);

    return {
      user,
      token,
    };
  }
}

export default AuthenticateAction;
