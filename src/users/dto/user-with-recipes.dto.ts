import { Expose, Type } from 'class-transformer';
import { RecipeSimpleDto } from '../../recipes/dto/recipe-simple.dto';

export class UserWithRecipesDto {
  @Expose()
  id_user: number;

  @Expose()
  identifiant: string;

  @Expose()
  role: string;

  @Expose()
  photo: string;

  @Expose()
  @Type(() => RecipeSimpleDto)
  recipes: RecipeSimpleDto[];
}
