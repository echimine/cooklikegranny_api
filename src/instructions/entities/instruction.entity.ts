import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Recipes } from '../../recipes/recipe.entity'; // <-- ajuste le chemin si besoin

@Entity()
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
