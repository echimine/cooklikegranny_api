import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Recipes } from '../../recipes/recipe.entity';

@Entity()
@Unique(['ordre', 'recipe']) // ordre unique pour chaque recette
export class Instructions {
  @PrimaryGeneratedColumn()
  id_instruction: number;

  @Column()
  text_instruction: string;

  @Column()
  ordre: number;

  @ManyToOne(() => Recipes, (recipe) => recipe.instructions, {
    eager: true,
    onDelete: 'CASCADE',
  })
  recipe: Recipes;
}
