import 'reflect-metadata';
import { getCustomRepository } from 'typeorm';
import {
  useSeeding,
  runSeeder,
  tearDownDatabase,
  factory,
} from 'typeorm-seeding';
import CreateRoomsSeeder from '@database/seeds/CreateRoomsSeeder';
import JoinRoomAction from '@app/actions/JoinRoomAction';
import LeaveRoomAction from '@app/actions/LeaveRoomAction';
import UsersRepository from '@app/repositories/UsersRepository';
import RoomRepository from '@app/repositories/RoomRepository';

import User from '@app/entities/User';
import ServerFactory from '../../../../server';

describe('LeaveRoomAction', () => {
  beforeAll(async done => {
    await ServerFactory.connectionPGCreate();
    await useSeeding({ connection: 'test' });
    done();
  });
  beforeEach(async done => {
    await runSeeder(CreateRoomsSeeder);
    done();
  });

  afterAll(async done => {
    await tearDownDatabase();
    done();
  });

  it('should remove a user from participants table', async () => {
    const userRepository = getCustomRepository(UsersRepository);
    const roomRepository = getCustomRepository(RoomRepository);
    const joinAction = new JoinRoomAction();
    const leaveAction = new LeaveRoomAction();

    const room = await roomRepository.findOne();
    const user = await factory(User)().create();

    await joinAction.execute({
      roomId: room?.id as string,
      userId: user.id,
    });
    await leaveAction.execute({
      roomId: room?.id as string,
      userId: user.id,
    });
    const userWithoutRoom = await userRepository.findOne(user.id, {
      relations: ['rooms'],
    });

    expect(userWithoutRoom).not.toBeNull();
    expect(userWithoutRoom?.rooms).toHaveLength(0);
  });
});
