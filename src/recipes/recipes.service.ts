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
import { RecipePreviewDto } from './dto/recipes-preview.dto';
import { RecipeDetailDto } from './dto/after-creation';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipes)
    private recipesRepo: Repository<Recipes>,
  ) {}

  async findAll(): Promise<RecipePreviewDto[]> {
    const recipes = await this.recipesRepo
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.user', 'user') // jointure avec user
      .leftJoinAndSelect('recipe.instructions', 'instructions') // jointure avec instructions
      .select([
        'recipe.id_recipe',
        'recipe.title',
        'recipe.description',
        'recipe.img_vignette',
        'user.id_user',
        'user.identifiant',
        'user.role',
        'instructions.id_instruction',
        'instructions.text_instruction',
        'instructions.ordre',
      ])
      .getMany();

    return recipes.map((recipe) => ({
      id_recipe: recipe.id_recipe,
      title: recipe.title,
      description: recipe.description,
      img_vignette: recipe.img_vignette,
      user: {
        id_user: recipe.user.id_user,
        identifiant: recipe.user.identifiant,
        role: recipe.user.role,
      },
      instructions: recipe.instructions.map((instr) => ({
        id_instruction: instr.id_instruction,
        text_instrcution: instr.text_instruction,
        ordre: instr.ordre,
      })),
    }));
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

  async create(
    createRecipeDto: CreateRecipeDto,
    userId: number,
  ): Promise<RecipeDetailDto> {
    // Création et sauvegarde de la recette
    const newRecipe = this.recipesRepo.create({
      ...createRecipeDto,
      user: { id_user: userId }, // Associe la relation
    });
    const savedRecipe = await this.recipesRepo.save(newRecipe);

    // Pour renvoyer l'utilisateur simplifié, on charge ses données
    const recipeWithUser = await this.recipesRepo.findOne({
      where: { id_recipe: savedRecipe.id_recipe },
      relations: ['user'],
    });

    if (!recipeWithUser) {
      throw new NotFoundException('Recette non trouvée après création');
    }

    // ici recipeWithUser est sûr d'exister, plus d'erreur TypeScript
    const dto = new RecipeDetailDto();
    dto.id_recipe = recipeWithUser.id_recipe;
    dto.title = recipeWithUser.title;
    dto.description = recipeWithUser.description;
    dto.img_vignette = recipeWithUser.img_vignette;
    dto.user = {
      id_user: recipeWithUser.user.id_user,
      identifiant: recipeWithUser.user.identifiant,
      role: recipeWithUser.user.role,
    };

    return dto;
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
