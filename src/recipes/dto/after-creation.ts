// src/recipes/dto/recipe-detail.dto.ts
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class RecipeUserDto {
  @IsNumber()
  id_user: number;

  @IsString()
  identifiant: string;

  @IsString()
  role: string;
}

export class RecipeDetailDto {
  @IsNumber()
  id_recipe: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  img_vignette?: string;

  user: RecipeUserDto;
}
