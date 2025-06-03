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

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id_user: number) {
    return this.usersService.findOne(id_user);
  }
  @Get('by-identifiant/:identifiant')
  findByIdentifiant(@Param('identifiant') identifiant: string) {
    return this.usersService.findByIdentifiant(identifiant);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const identifiant  = req.body.identifiant;
          const fs = require('fs');
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
    const photoPath = file
      ? `/uploads/profils/${createUserDto.identifiant}/${file.filename}`
      : undefined;

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
