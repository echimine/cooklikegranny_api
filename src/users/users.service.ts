import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PreviewUserDto } from './dto/preview-users.dto';

import { UserWithRecipesDto } from './dto/user-with-recipes.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepo: Repository<Users>,
  ) {}

  async findAll(): Promise<UserWithRecipesDto[]> {
    const users = await this.usersRepo.find({
      order: { id_user: 'ASC' },
      relations: ['recipes', 'recipes.instructions'],
    });

    return plainToInstance(UserWithRecipesDto, users, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number): Promise<UserWithRecipesDto | null> {
    const user = await this.usersRepo.findOne({
      where: { id_user: id },
      relations: ['recipes', 'recipes.instructions'],
    });

    if (!user) return null;

    return plainToInstance(UserWithRecipesDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async findByIdentifiant(
    identifiant: string,
  ): Promise<UserWithRecipesDto | null> {
    const user = await this.usersRepo.findOne({
      where: { identifiant },
      relations: ['recipes', 'recipes.instructions'],
    });

    if (!user) return null;

    return plainToInstance(UserWithRecipesDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string; user: PreviewUserDto }> {
    const existingUser = await this.usersRepo.findOne({
      where: { identifiant: createUserDto.identifiant },
    });

    if (existingUser) {
      throw new HttpException(
        'Cet identifiant est déjà utilisé.',
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.usersRepo.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepo.save(newUser);

    // ✅ Transformation en PreviewUserDto sans mot de passe
    const previewUser = plainToInstance(PreviewUserDto, savedUser, {
      excludeExtraneousValues: true,
    });

    return {
      message: 'Utilisateur créé avec succès.',
      user: previewUser,
    };
  }
}
