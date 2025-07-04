import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRatingDto } from './create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    private prisma: PrismaService
  ) { }

  async createRating(userId: number, createRatingDto: CreateRatingDto) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: createRatingDto.recipeId },
    });
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    const existingRating = await this.prisma.rating.findFirst({
      where: { userId, recipeId: createRatingDto.recipeId },
    });

    if (existingRating) {
      throw new ForbiddenException('Recipe already rated');
    }

    return this.prisma.rating.create({
      data: {
        value: createRatingDto.value,
        recipeId: createRatingDto.recipeId,
        userId,
      },
    });
  }

  async getRatingsForRecipe(recipeId: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
    });
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    return this.prisma.rating.findMany({
      where: { recipeId },
      include: { user: { select: { email: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
