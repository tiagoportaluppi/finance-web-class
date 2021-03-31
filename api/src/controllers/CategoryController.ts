import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { CategoriesRepository } from '../repositories/CategoriesRepository';
// import { AppError } from '../errors/AppError';

export class CategoryController {
  async create(request: Request, response: Response) {
    const { name, color } = request.body;

    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const category = categoriesRepository.create({ name, color });

    await categoriesRepository.save(category);

    return response.status(200).json({ message: 'Categoria criada com sucesso', category });
  }

  async getAll(request: Request, response: Response) {
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const categories = await categoriesRepository.find();

    return response.status(200).json({ docs: categories });
  }

  async update(request: Request, response: Response) {
    const { categoryId } = request.params;
    const { name, color } = request.body;

    const updatedData: any = {};
    if (name) updatedData.name = name;
    if (color) updatedData.color = color;

    const categoriesRepository = getCustomRepository(CategoriesRepository);

    await categoriesRepository.save({ id: parseInt(categoryId), ...updatedData });

    return response.status(200).json({ message: 'Categoria atualizada com sucesso' });
  }

  async delete(request: Request, response: Response) {
    const { categoryId } = request.params;

    const categoriesRepository = getCustomRepository(CategoriesRepository);

    await categoriesRepository.delete(parseInt(categoryId));

    return response.status(200).json({ message: 'Categoria excluída com sucesso' });
  }
}
