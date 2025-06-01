import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecipesModule } from './recipes/recipes.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipes } from './recipes/recipe.entity';
import { InstructionsModule } from './instructions/instructions.module';
import { Instructions } from './instructions/entities/instruction.entity';
import { UsersModule } from './users/users.module';
import { Users } from './users/entities/user.entity';
// import { Users } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
// import { Auth } from './auth/entities/auth.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), // accès partout au .env

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [Recipes, Instructions, Users],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),

    RecipesModule,
    InstructionsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
