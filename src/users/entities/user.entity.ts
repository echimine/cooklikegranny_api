import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Recipes } from 'src/recipes/recipe.entity';
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column({ unique: true })
  identifiant: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ nullable: true })
  photo?: string;

  @OneToMany(() => Recipes, (recipe) => recipe.user)
  recipes: Recipes[];
}
