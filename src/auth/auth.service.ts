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
    const user = await this.usersRepo.findOne({
      where: { identifiant: loginDto.identifiant },
      select: ['id_user', 'identifiant', 'password', 'role'], // on récupère le rôle pour plus tard
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

    // 🧠 On génère ici le payload du token
    const payload = {
      sub: user.id_user, // sub = subject (celui à qui le token appartient)
      identifiant: user.identifiant,
      role: user.role, // utile pour les guards plus tard
    };

    const token = this.jwtService.sign(payload); // ✅ création du token

    return {
      access_token: token,
    };
  }
}
