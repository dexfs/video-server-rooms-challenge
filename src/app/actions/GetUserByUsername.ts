import { getCustomRepository } from 'typeorm';

import UsersRepository from '@app/repositories/UsersRepository';
import { NotFound } from '@app/exceptions/errors';
import User from '@app/entities/User';

interface Input {
  username: string;
}

class GetUserByUsername {
  async execute({ username }: Input): Promise<User | undefined> {
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findByUsername(username);
    if (!user) {
      throw new NotFound('User not found.');
    }

    return user;
  }
}

export default GetUserByUsername;
