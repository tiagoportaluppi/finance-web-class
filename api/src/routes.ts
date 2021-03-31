import { Router } from 'express';

import { AuthController } from './controllers/AuthController';
import { UserController } from './controllers/UserController';
import { CategoryController } from './controllers/CategoryController';

export default ({ auth }) => {
  const router = Router();

  const authController = new AuthController();
  const userController = new UserController();
  const categoryController = new CategoryController();

  router.post('/auth', authController.signin);

  router.post('/users', userController.create);
  router.get('/me', auth.authenticate(), userController.getById);

  router.get('/categories', auth.authenticate(), categoryController.getAll);
  router.post('/categories', auth.authenticate(), categoryController.create);
  router.patch('/categories/:categoryId', auth.authenticate(), categoryController.update);
  router.delete('/categories/:categoryId', auth.authenticate(), categoryController.delete);

  return router;
};
