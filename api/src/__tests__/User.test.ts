import request from 'supertest';
import { getConnection } from 'typeorm';

import { app } from '../app';
import createConnection from '../database';
import { signin } from './utils/auth.mock';

describe('Users', () => {
  let accessToken = null;

  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
    accessToken = await signin(app);
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to create a new user', async () => {
    const newUser = {
      email: 'user@example.com',
      name: 'User Example',
      password: 'passwd',
    };

    const response = await request(app).post('/users').send(newUser);

    expect(response.status).toBe(200);
  });

  it('Should not be able to create user with exists email', async () => {
    const newUser = {
      email: 'user@example.com',
      name: 'User Example',
      password: 'passwd',
    };

    const response = await request(app).post('/users').send(newUser);

    expect(response.status).toBe(400);
  });

  it('Should not be able to create user with invalid email', async () => {
    const newUser = {
      email: 'user@example',
      name: 'User Example',
      password: 'passwd',
    };

    const response = await request(app).post('/users').send(newUser);

    expect(response.status).toBe(400);
    expect(response.body.message.errors).toContain('Invalid e-mail');
  });

  it('Should be able to get a logged user', async () => {
    const response = await request(app).get('/users/me').set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });
});
