import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecipeDto } from './create-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(
    private prisma: PrismaService
  ) { }

  async createRecipe(
    userId: number,
    createRecipeDto: CreateRecipeDto
  ) {
    return this.prisma.recipe.create({
      data: {
        userId,
        ...createRecipeDto
      }
    })
  }

  async findRecipes(search?: string) {
    return this.prisma.recipe.findMany({
      where: search ? { title: { contains: search, mode: 'insensitive' } } : {},
      include: { user: { select: { email: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findRecipeById(id: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: { user: { select: { email: true, name: true } } },
    });
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
    return recipe;
  }

  async findMyRecipes(userId: number) {
    return this.prisma.recipe.findMany({
      where: { userId },
      include: { user: { select: { email: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteRecipe(id: number, userId: number) {
    console.log(userId);
    
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (recipe.userId !== userId) {
      console.log(userId, recipe);
      
      throw new ForbiddenException('You can only delete your own recipes');
    }

    await this.prisma.recipe.delete({
      where: { id },
    });

    return { message: 'Recipe deleted successfully' };
  }
}
