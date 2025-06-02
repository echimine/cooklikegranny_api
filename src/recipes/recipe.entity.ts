import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Instructions } from '../instructions/entities/instruction.entity';
import { Users } from '../users/entities/user.entity';

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
  @OneToMany(() => Instructions, (instruction) => instruction.recipe, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  instructions: Instructions[];

  @ManyToOne(() => Users, (user) => user.recipes, { eager: true })
  user: Users;
}
