// recipe-with-user.dto.ts

export class UserBriefDto {
  id_user: number;
  identifiant: string;
  role: string;
}

export class InstructionsDto {
  id_instruction: number;
  text_instruction: string;
  ordre: string;
}

export class RecipePreviewDto {
  id_recipe: number;
  title: string;
  description: string;
  img_vignette: string;
  user: UserBriefDto;
}
