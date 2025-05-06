// src/recipes/dto/recipe-preview.dto.ts
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
export class RecipePreviewDto {
  @IsString()
  @IsNotEmpty({ message: 'Le titre est requis' })
  title: string;

  @IsString()
  @MinLength(10, {
    message: 'La description doit faire au moins 10 caractères',
  })
  img_vignette: string;
}
