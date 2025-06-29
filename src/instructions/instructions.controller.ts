import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { InstructionsService } from './instructions.service';
import { InstructionPreviewDto } from './dto/preview-instruction.dto';
import { CreateInstructionDto } from './dto/create-instruction.dto';
import { UpdateInstructionDto } from './dto/update-instruction.dto';

@Controller('instructions')
export class InstructionsController {
  constructor(private readonly instructionsService: InstructionsService) {}

  @Get()
  async getAll(): Promise<InstructionPreviewDto[]> {
    const instructions = await this.instructionsService.findAll();
    return instructions.map((instruction) => ({
      id_instruction: instruction.id_instruction,
      text_instruction: instruction.text_instruction,
      ordre: instruction.ordre,
      id_recipe: instruction.recipe?.id_recipe,
    }));
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InstructionPreviewDto> {
    const instruction = await this.instructionsService.findOne(id);
    return {
      id_instruction: instruction.id_instruction,
      text_instruction: instruction.text_instruction,
      ordre: instruction.ordre,
      id_recipe: instruction.recipe?.id_recipe,
    };
  }

  @Get('recipe/:id')
  async findByRecipeId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InstructionPreviewDto[]> {
    const instructions = await this.instructionsService.findByRecipeId(id);
    return instructions.map((instruction) => ({
      id_instruction: instruction.id_instruction,
      text_instruction: instruction.text_instruction,
      ordre: instruction.ordre,
      id_recipe: instruction.recipe?.id_recipe,
    }));
  }

  @Post()
  async create(
    @Body() createInstructionDto: CreateInstructionDto,
  ): Promise<InstructionPreviewDto> {
    const instruction =
      await this.instructionsService.create(createInstructionDto);

    return {
      id_instruction: instruction.id_instruction,
      text_instruction: instruction.text_instruction,
      ordre: instruction.ordre,
      id_recipe: instruction.recipe?.id_recipe,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInstructionDto: UpdateInstructionDto,
  ): Promise<InstructionPreviewDto> {
    const instruction = await this.instructionsService.update(
      id,
      updateInstructionDto,
    );

    return {
      id_instruction: instruction.id_instruction,
      text_instruction: instruction.text_instruction,
      ordre: instruction.ordre,
      id_recipe: instruction.recipe?.id_recipe,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.instructionsService.remove(id);
    return { message: `Instruction avec l'ID ${id} supprimée avec succès` };
  }
}
