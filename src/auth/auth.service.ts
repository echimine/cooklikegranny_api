import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from '../users/entities/user.entity';
import { LoginUserDto } from './dto/Login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepo: Repository<Users>,
    private jwtService: JwtService, // <-- injection du service JWT
  ) {}

  async signIn(loginDto: LoginUserDto): Promise<{ access_token: string }> {
    try {
      const user = await this.usersRepo.findOne({
        where: { identifiant: loginDto.identifiant },
        select: ['id_user', 'identifiant', 'password', 'role'],
      });

      if (!user) {
        throw new NotFoundException("L'identifiant est incorrect");
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Le mot de passe est incorrect');
      }

      const payload = {
        sub: user.id_user,
        identifiant: user.identifiant,
        role: user.role,
      };

      const token = this.jwtService.sign(payload);

      return { access_token: token };
    } catch (error) {
      console.error('Erreur dans signIn:', error);
      throw error; // Relancer pour que Nest gère l'exception
    }
  }
}
