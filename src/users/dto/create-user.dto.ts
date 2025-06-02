import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: "l'identifiant est requis" })
  identifiant: string;

  @IsString()
  @IsNotEmpty({ message: 'un mot de passe est requis' })
  @MinLength(10, {
    message: 'le mot de passe doit contenir au moins 10 caractères',
  })
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  photo?: string;
}
