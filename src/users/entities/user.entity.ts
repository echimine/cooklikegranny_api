import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column()
  identifiant: string;

  @Column({ select: false })
  password: string;
}
