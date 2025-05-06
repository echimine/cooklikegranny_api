// src/recipes/recipes.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipes } from './recipe.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipes)
    private recipeRepo: Repository<Recipes>,
  ) {}

  findAll(): Promise<Recipes[]> {
    return this.recipeRepo.find();
  }

  async create(
    title: string,
    description: string,
    image?: string, //si il y a une image car pas obligatoire
  ): Promise<Recipes> {
    const recipe = this.recipeRepo.create({
      title,
      description,
      img_vignette: image,
    });
    return this.recipeRepo.save(recipe);
  }
}
