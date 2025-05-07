import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entities/user.entity';
// import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    UsersModule, // au cas où tu veux injecter UsersService
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // ⚠️ à définir dans .env
      signOptions: { expiresIn: '1h' }, // le token expire en 1 heure
    }),
  ],
  providers: [AuthService], //JwtStrategy
  controllers: [AuthController],
})
export class AuthModule {}
