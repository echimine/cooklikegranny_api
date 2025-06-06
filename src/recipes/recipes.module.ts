// src/recipes/recipes.module.ts
import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipes } from './recipe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recipes])],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
