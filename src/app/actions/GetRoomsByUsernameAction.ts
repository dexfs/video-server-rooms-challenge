import { getCustomRepository } from 'typeorm';
import UsersRepository from '@app/repositories/UsersRepository';
import Room from '@app/entities/Room';
import { NotFound } from '@shared/utils/errors';

interface Input {
  username: string;
}

class GetRoomsByUsername {
  public async execute({ username }: Input): Promise<Room[][]> {
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findByUsername(username, {
      relations: ['rooms', 'rooms.room'],
    });

    if (!user) {
      throw new NotFound('User not found!');
    }

    const rooms = user.rooms.reduce<Room[][]>((acc: any, current: any) => {
      acc = [...acc, current.room];
      return acc;
    }, []);

    return rooms;
  }
}

export default GetRoomsByUsername;
