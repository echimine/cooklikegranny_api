import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instructions } from './entities/instruction.entity';
import { CreateInstructionDto } from './dto/create-instruction.dto';
import { UpdateInstructionDto } from './dto/update-instruction.dto';

@Injectable()
export class InstructionsService {
  constructor(
    @InjectRepository(Instructions)
    private instructionsRepo: Repository<Instructions>,
  ) {}

  async findAll(): Promise<Instructions[]> {
    return this.instructionsRepo.find({
      relations: ['recipe'],
    });
  }

  async findOne(id: number): Promise<Instructions> {
    const instruction = await this.instructionsRepo.findOne({
      where: { id_instruction: id },
      relations: ['recipe'],
    });

    if (!instruction) {
      throw new NotFoundException(`Instruction avec l'ID ${id} non trouvée`);
    }

    return instruction;
  }

  async findByRecipeId(recipeId: number): Promise<Instructions[]> {
    return this.instructionsRepo.find({
      where: { recipe: { id_recipe: recipeId } },
      order: { ordre: 'ASC' },
    });
  }

  async create(
    createInstructionDto: CreateInstructionDto,
  ): Promise<Instructions> {
    const newInstruction = this.instructionsRepo.create({
      text_instruction: createInstructionDto.text_instruction,
      ordre: createInstructionDto.ordre,
      recipe: { id_recipe: createInstructionDto.id_recipe },
    });

    return this.instructionsRepo.save(newInstruction);
  }

  async update(
    id: number,
    updateInstructionDto: UpdateInstructionDto,
  ): Promise<Instructions> {
    console.log("Service - Mise à jour de l'instruction ID:", id);
    console.log('Service - DTO reçu:', updateInstructionDto);

    const instruction = await this.findOne(id);
    console.log('Service - Instruction avant mise à jour:', instruction);

    // Mise à jour des propriétés si elles sont fournies
    if (updateInstructionDto.text_instruction !== undefined) {
      instruction.text_instruction = updateInstructionDto.text_instruction;
    }

    if (updateInstructionDto.ordre !== undefined) {
      instruction.ordre = updateInstructionDto.ordre;
    }

    if (updateInstructionDto.id_recipe !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      instruction.recipe = { id_recipe: updateInstructionDto.id_recipe } as any;
    }

    console.log('Service - Instruction après modifications:', instruction);

    const savedInstruction = await this.instructionsRepo.save(instruction);
    console.log('Service - Instruction sauvegardée:', savedInstruction);

    return savedInstruction;
  }

  async remove(id: number): Promise<void> {
    const result = await this.instructionsRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Instruction avec l'ID ${id} non trouvée`);
    }
  }
}
