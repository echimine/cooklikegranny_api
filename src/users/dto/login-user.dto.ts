// src/users/dto/login-user.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty({ message: "l'identifiant est requis" })
  identifiant: string;

  @IsString()
  @IsNotEmpty({ message: 'le mot de passe est requis' })
  password: string;
}
