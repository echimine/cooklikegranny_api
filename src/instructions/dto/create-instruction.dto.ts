import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateInstructionDto {
  @IsNotEmpty({ message: 'Le text_instruction est requis' })
  @IsString()
  text_instruction?: string;

  @IsNotEmpty({ message: "l'ordre de l'étape est nécessaire" })
  @IsInt()
  ordre: number;
  @IsNotEmpty({ message: "relié la à l'id_recipe" })
  id_recipe?: number;
}
