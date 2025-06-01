import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service'; // corrige le chemin si besoin
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService, // <== injecté ici
  ) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id_user: number) {
    return this.usersService.findOne(id_user);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    // Étape 1 : créer l'utilisateur
    const created = await this.usersService.create(createUserDto);

    // Étape 2 : générer un token automatiquement
    const token = await this.authService.signIn({
      identifiant: createUserDto.identifiant,
      password: createUserDto.password,
    });

    return {
      ...created, // { message, user }
      access_token: token.access_token,
    };
  }
}
