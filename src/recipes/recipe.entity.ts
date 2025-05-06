import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Instructions } from '../instructions/entities/instruction.entity';

@Entity()
export class Recipes {
  @PrimaryGeneratedColumn()
  id_recipe: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  img_vignette: string;

  // Vous pouvez avoir d'autres colonnes ici...

  // Relation avec les instructions
  @OneToMany(() => Instructions, (instruction) => instruction.recipe)
  instructions: Instructions[];
}
