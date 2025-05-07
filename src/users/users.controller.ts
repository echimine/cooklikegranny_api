import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id_user: number) {
    return this.usersService.findOne(id_user);
  }

  @Post()
  create(@Body() createUserDTO: CreateUserDto) {
    return this.usersService.create(createUserDTO);
  }
}
