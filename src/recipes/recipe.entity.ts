// src/recipes/recipe.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Recipes {
  @PrimaryGeneratedColumn()
  id_recipe: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true }) // facultatif au début
  img_vignette: string;
}
