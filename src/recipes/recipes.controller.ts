import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.gards';

import { AuthenticatedRequest } from '../types/express';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  async findAll() {
    const recipes = await this.recipesService.findAll();
    return recipes;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const recipe = await this.recipesService.findOne(id);

    // Pour une recette spécifique, on inclut les instructions
    return {
      id_recipe: recipe.id_recipe,
      title: recipe.title,
      description: recipe.description,
      img_vignette: recipe.img_vignette,
      // Ajout des autres champs de recette que vous pourriez avoir...

      // Formatage des instructions
      instructions: recipe.instructions
        ? recipe.instructions.map((instruction) => ({
            id_instruction: instruction.id_instruction,
            text_instruction: instruction.text_instruction,
            ordre: instruction.ordre,
          }))
        : [],
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req: AuthenticatedRequest, @Body() dto: CreateRecipeDto) {
    return this.recipesService.create(dto, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipesService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.recipesService.remove(id);
    return { message: `Recette avec l'ID ${id} supprimée avec succès` };
  }
}
