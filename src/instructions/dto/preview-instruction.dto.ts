// src/instructions/dto/instruction-preview.dto.ts
import { Expose } from 'class-transformer';
export class InstructionPreviewDto {
  @Expose()
  id_instruction: number;

  @Expose()
  text_instruction: string;

  @Expose()
  ordre: number;

  @Expose()
  id_recipe: number;
}
