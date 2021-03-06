import 'reflect-metadata';
import 'jest-extended';
import { useSeeding, factory } from 'typeorm-seeding';
import { getCustomRepository } from 'typeorm';
import supertest from 'supertest';
import User from '@app/entities/User';
import TokenService from '@app/services/tokenService';
import Room from '@app/entities/Room';
import UsersRepository from '@app/repositories/UsersRepository';
import RoomParticipantRepository from '@app/repositories/RoomParticipantRepository';
import { startTestServer } from '../../__utils';
import ServerFactory from '../../../server';

describe('Rooms Join and Leave - e2e', () => {
  let request: supertest.SuperTest<supertest.Test>;
  let rooms: any;
  let users: User[];
  let tokenService: TokenService;

  beforeAll(async done => {
    await useSeeding({ connection: 'test' });
    await ServerFactory.connectionPGCreate();
    rooms = await factory(Room)().createMany(5);
    users = await factory(User)().createMany(2);
    tokenService = new TokenService();
    request = await startTestServer();
    done();
  });

  afterAll(async done => {
    await ServerFactory.connectionPGClose();
    done();
  });

  it('Join in a room', async done => {
    expect.assertions(2);
    const userRepository = getCustomRepository(UsersRepository);
    const room = rooms[Math.floor(Math.random() * rooms.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const token = tokenService.generate(user);

    const response = await request
      .post(`/rooms/${room.id}/join`)
      .set('Authorization', `bearer ${token}`);

    const userWithRooms = await userRepository.findOne(user.id, {
      relations: ['rooms'],
    });

    expect(response.status).toBe(200);
    expect(userWithRooms?.rooms).toHaveLength(1);
    done();
  });

  it('Leave from a room', async done => {
    expect.assertions(2);
    const userRepository = getCustomRepository(UsersRepository);
    const roomParticipantRepository = getCustomRepository(
      RoomParticipantRepository,
    );

    const room = rooms[Math.floor(Math.random() * rooms.length)];
    const user = await factory(User)().create();

    await roomParticipantRepository.create({
      userId: user.id,
      roomId: room.id,
    });

    const token = tokenService.generate(user);

    const response = await request
      .delete(`/rooms/${room.id}/leave`)
      .set('Authorization', `bearer ${token}`);

    const userWithRooms = await userRepository.findOne(user.id, {
      relations: ['rooms'],
    });

    expect(response.status).toBe(200);
    expect(userWithRooms?.rooms).toHaveLength(0);
    done();
  });

  it('it should return 400 when invalid id is sent', async done => {
    expect.assertions(2);
    const user = users[Math.floor(Math.random() * users.length)];
    const token = tokenService.generate(user);
    let response;
    response = await request
      .post(`/rooms/1/join`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);

    response = await request
      .delete(`/rooms/1/leave`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);

    done();
  });
});
