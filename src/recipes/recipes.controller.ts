// src/recipes/recipes.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { RecipesService } from './recipes.service';
import { Recipes } from './recipe.model';
import { CreateRecipeDto } from './dto/create-recipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  async getAll(): Promise<Recipes[]> {
    return this.recipesService.findAll();
  }
  //method post
  @Post()
  @HttpCode(HttpStatus.CREATED) //met le code
  @UseInterceptors(FileInterceptor('image', { dest: './temp' })) // 👈 fichier uploadé temporairement ici
  async createRecipe(
    @Body() body: CreateRecipeDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{
    message: string;
    data: Recipes;
  }> {
    //gestion du déplacement de l'image de temp dans public/uploads
    const folderName = body.title.toLowerCase().replace(/\s+/g, '-');
    console.log(folderName);
    const finalDir = `./public/uploads/${folderName}`;
    fs.mkdirSync(finalDir, { recursive: true }); // crée le dossier si besoin

    const ext = path.extname(file.originalname);
    const fileName = `vignette-${Date.now()}${ext}`;
    const finalPath = path.join(finalDir, fileName);

    fs.renameSync(file.path, finalPath); // déplace le fichier

    const relativePath = `uploads/${folderName}/${fileName}`; // ce qu'on va enregistrer en BDD

    const created = await this.recipesService.create(
      body.title,
      body.description,
      relativePath,
    );

    return {
      message: 'ok',
      data: created,
    };
  }
}
