import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import bcrypt from 'bcryptjs';

import { UsersRepository } from '../repositories/UsersRepository';
import { AppError } from '../errors/AppError';

export class UserController {
  async create(request: Request, response: Response) {
    const { name, email, password } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required('Name is required'),
      email: yup.string().email('Invalid e-mail').required('E-mail is required'),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (error) {
      throw new AppError(error);
    }

    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await usersRepository.findOne({ email });

    if (userAlreadyExists) {
      throw new AppError('Usuário já existe!');
    }

    const salt = bcrypt.genSaltSync();

    const user = usersRepository.create({
      name,
      email,
      password: bcrypt.hashSync(password, salt),
    });

    await usersRepository.save(user);

    return response.status(200).send({ message: 'Usuário criado com sucesso', user });
  }

  async getById(request: Request, response: Response) {
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findOne(request?.user?.['id']);

    if (!user) throw new AppError('Usuário não encontrado', 404);

    delete user?.password;

    return response.status(200).json(user);
  }
}
