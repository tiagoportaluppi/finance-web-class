import request from 'supertest';
import { getConnection } from 'typeorm';

import { app } from '../app';
import createConnection from '../database';

describe('Auth', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to authenticate a user', async () => {
    const userTest = {
      email: 'auth.user@test.com',
      name: 'User Test',
      password: 'passwd',
    };

    await request(app).post('/users').send(userTest);

    const response = await request(app).post('/auth').send({
      email: userTest.email,
      password: userTest.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
  });

  it('Should be able to deny user not authorized', async () => {
    const credentials = {
      email: 'user.not.exists@test.com',
      password: 'passwd',
    };

    const response = await request(app).post('/auth').send(credentials);

    expect(response.status).toBe(401);
  });
});
