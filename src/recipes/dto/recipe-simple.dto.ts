import { Expose } from 'class-transformer';
import { InstructionPreviewDto } from 'src/instructions/dto/preview-instruction.dto';

export class RecipeSimpleDto {
  @Expose()
  id_recipe: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  img_vignette: string;

  @Expose()
  instructions: InstructionPreviewDto[];
}
