import { IsNotEmpty, IsString } from 'class-validator';
export class previewUserDto {
  @IsString()
  @IsNotEmpty({ message: 'identifiant requis' })
  title: string;

  @IsNotEmpty({ message: 'password requis' })
  password: any;
}
