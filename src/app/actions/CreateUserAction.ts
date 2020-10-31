import { getCustomRepository } from 'typeorm';

import UserRepository from '@app/repositories/UsersRepository';
import TokenService from '@app/services/tokenService';
import { GeneralError } from '@app/exceptions/errors';
import User from '@app/entities/User';
import AbstractAction from './ActionAbstract';

interface Input {
  username: string;
  password: string;
  mobileToken?: string;
}

interface Result {
  user: User;
  token: string;
}

class CreateUserAction  extends AbstractAction {
  public async execute({
    username,
    password,
    mobileToken,
  }: Input): Promise<Result> {
    const {userRepository} = this.loadRepositories();
    const userExists = await userRepository.findByUsername(username);

    if (userExists) {
      throw new GeneralError(`Oh no!, this ${username} already used`);
    }

    const user = await userRepository.create({
      username,
      password,
      mobileToken,
    });

    await userRepository.save(user);

    delete user.password;

    const tokenService = new TokenService();
    const token = tokenService.generate(user.id);
    return {
      user,
      token,
    };
  }

  loadRepositories() {
    return {
      userRepository: getCustomRepository(UserRepository)
    }
  }
}

export default CreateUserAction;
