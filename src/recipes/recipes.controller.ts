import { Body, Controller, Delete, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateRecipeDto } from './create-recipe.dto';
import { GetUser } from 'src/get-user.decorator';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@GetUser() user, @Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.createRecipe(user.userId, createRecipeDto);
  }

  @Get()
  async find(@Query('search') search: string) {
    return this.recipesService.findRecipes(search);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  async findMyRecipes(@Request() req) {
    return this.recipesService.findMyRecipes(req.user.userId);
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    return this.recipesService.findRecipeById(parseInt(id));
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteRecipe(@GetUser() user,@Param('id') id: number) {
    return this.recipesService.deleteRecipe(id, user.userId);
  }
}
