import request from 'supertest';
import { getConnection, getCustomRepository } from 'typeorm';

import { app } from '../app';
import createConnection from '../database';
import { CategoriesRepository } from '../repositories/CategoriesRepository';
import { signin } from './utils/auth.mock';

describe('Categories', () => {
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

  it('Should be able to create a new category', async () => {
    const newCategory = {
      name: 'Name Example',
      color: '#000',
    };

    const response = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newCategory);

    expect(response.status).toBe(200);
    expect(response.body.category).toHaveProperty('id');
  });

  it('Should be able to get all categories', async () => {
    const response = await request(app).get('/categories').set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.docs.length).toBe(1);
  });

  it('Should be able to update a category', async () => {
    const { body } = await request(app).get('/categories').set('Authorization', `Bearer ${accessToken}`);
    const categoryId = body.docs[0].id;

    const newData = {
      name: 'Name Example 2',
      color: '#fff',
    };

    const response = await request(app)
      .patch(`/categories/${categoryId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newData);

    const categoriesRepository = getCustomRepository(CategoriesRepository);
    const category = await categoriesRepository.findOne(categoryId);

    expect(response.status).toBe(200);
    expect(category.name).toBe(newData.name);
    expect(category.color).toBe(newData.color);
  });

  it('Should be able to delete a category', async () => {
    const { body } = await request(app).get('/categories').set('Authorization', `Bearer ${accessToken}`);
    const categoryId = body.docs[0].id;

    const response = await request(app)
      .delete(`/categories/${categoryId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
  });

  // it('Should be able to get a category by id', async () => {
  //   const { body } = await request(app).get('/categories');
  //   const categoryId = body.docs[0].id;

  //   const response = await request(app).get(`/categories/${categoryId}`);

  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty('id');
  //   expect(response.body.id).toBe(categoryId);
  // });
});
