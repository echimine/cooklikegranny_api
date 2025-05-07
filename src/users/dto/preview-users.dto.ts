import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';
export class previewUserDto {
  @IsString()
  @IsNotEmpty({ message: 'identifiant requis' })
  title: string;

  @IsNotEmpty({ message: 'password requis' })
  password: any;

  @IsEnum(UserRole)
  role: UserRole;
}
