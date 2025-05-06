import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateInstructionDto {
  @IsOptional()
  @IsString()
  text_instruction?: string;

  @IsOptional()
  @IsInt()
  ordre?: number;

  id_recipe?: number;
}
