import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructions } from './entities/instruction.entity';
import { InstructionsService } from './instructions.service';
import { InstructionsController } from './instructions.controller';
import { Recipes } from 'src/recipes/recipe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Instructions, Recipes])], // 👈 c'est ça qui manque
  controllers: [InstructionsController],
  providers: [InstructionsService],
  exports: [InstructionsService],
})
export class InstructionsModule {}
