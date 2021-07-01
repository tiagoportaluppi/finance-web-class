import request from 'supertest';

export const signin = async (app) => {
  const userTest = {
    email: 'auth.user@test.com',
    name: 'User Test',
    password: 'passwd',
  };

  await request(app).post('/users').send(userTest);

  const response = await request(app).post('/auth/signin').send({
    email: userTest.email,
    password: userTest.password,
  });

  return response.body.accessToken;
};
