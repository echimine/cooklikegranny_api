import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepo: Repository<Users>,
  ) {}

  async findAll(): Promise<Users[]> {
    return this.usersRepo.find();
  }

  async findOne(id: number): Promise<Users | null> {
    return this.usersRepo.findOne({
      where: { id_user: id },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<Users> {
    //vérification de l'identifiant si il existe déjà
    const existingUser = await this.usersRepo.findOne({
      where: { identifiant: createUserDto.identifiant },
    });

    if (existingUser) {
      throw new HttpException(
        'Cet identifiant est déjà utilisé.',
        HttpStatus.CONFLICT,
      );
    }
    //password hashé
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.usersRepo.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepo.save(newUser);
  }
}
