import { Exclude, Expose } from 'class-transformer';
import { UserRole } from '../entities/user.entity';

export class PreviewUserDto {
  @Expose()
  id_user: number;

  @Expose()
  identifiant: string;

  @Expose()
  role: UserRole;

  @Expose()
  photo: string;

  @Exclude()
  password: string; // sera automatiquement exclu de la sortie JSON
}
