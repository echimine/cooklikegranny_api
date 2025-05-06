import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipes } from './recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipes)
    private recipesRepo: Repository<Recipes>,
  ) {}

  async findAll(): Promise<Recipes[]> {
    // Pour la liste, on ne charge pas les instructions
    return this.recipesRepo.find({
      select: ['id_recipe', 'title', 'img_vignette'],
    });
  }

  async findOne(id: number): Promise<Recipes> {
    // Pour une recette spécifique, on charge les instructions associées
    const recipe = await this.recipesRepo.findOne({
      where: { id_recipe: id },
      relations: ['instructions'], // Chargement des instructions liées
    });

    if (!recipe) {
      throw new NotFoundException(`Recette avec l'ID ${id} non trouvée`);
    }

    // Tri des instructions par ordre croissant
    if (recipe.instructions) {
      recipe.instructions.sort((a, b) => a.ordre - b.ordre);
    }

    return recipe;
  }

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipes> {
    const newRecipe = this.recipesRepo.create(createRecipeDto);
    return this.recipesRepo.save(newRecipe);
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto): Promise<Recipes> {
    const recipe = await this.findOne(id);

    // Mise à jour des propriétés
    Object.assign(recipe, updateRecipeDto);

    return this.recipesRepo.save(recipe);
  }

  async remove(id: number): Promise<void> {
    const recipe = await this.recipesRepo.findOneBy({ id_recipe: id });

    if (!recipe) {
      throw new NotFoundException(`Recette avec l'ID ${id} non trouvée`);
    }

    try {
      await this.recipesRepo.delete(id); // ou .delete(id) si tu préfères
    } catch (error) {
      if (error) {
        throw new ConflictException(
          `Impossible de supprimer la recette : elle est encore liée à des instructions.`,
        );
      }

      console.error('Erreur lors de la suppression de la recette:', error);
      throw new InternalServerErrorException(
        'Erreur serveur lors de la suppression. ' + error,
      );
    }
  }
}
