import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          console.log(req.body);
          const fs = require('fs');
          const identifiant = req.body?.identifiant;

          if (!identifiant) {
            return callback(new Error('Identifiant manquant'), '');
          }

          const path = `./public/uploads/profils/${identifiant}`;
          if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
          }

          callback(null, path);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ) {
    const identifiant = createUserDto.identifiant;
    const photoPath = `/uploads/profils/${identifiant}/${file.filename}`;
    const userWithPhoto = { ...createUserDto, photo: photoPath };

    const created = await this.usersService.create(userWithPhoto);

    const token = await this.authService.signIn({
      identifiant: createUserDto.identifiant,
      password: createUserDto.password,
    });

    return {
      ...created,
      access_token: token.access_token,
    };
  }
}
