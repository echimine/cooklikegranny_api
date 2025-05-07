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
    ConfigModule.forRoot({ isGlobal: true }), // accès partout au .env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', { infer: true }),
        port: parseInt(config.get<string>('DB_PORT') || '3306', 10),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [Recipes, Instructions, Users],
        synchronize: true,
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
