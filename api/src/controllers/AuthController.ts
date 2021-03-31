import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { UsersRepository } from '../repositories/UsersRepository';
import { User } from '../models/User';
import { AppError } from '../errors/AppError';

export class AuthController {
  async signin(request: Request, response: Response) {
    const { email, password } = request.body;

    if (!email || !password) throw new AppError('E-mail e/ou senha não informados', 400);

    const usersRepository = getCustomRepository(UsersRepository);

    const user: User = await usersRepository.findOne({ email });

    if (!user) {
      throw new AppError('Usuário não encontrado', 401);
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new AppError('Usuário não autorizado', 401);
    }

    return response.status(200).json({
      message: 'Usuário autenticado com sucesso',
      accessToken: jwt.sign({ id: user.id }, process.env.JWT_SECRET),
    });
  }
}
