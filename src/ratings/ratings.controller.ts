import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateRatingDto } from './create-rating.dto';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}


  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Request() req, @Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.createRating(req.user.userId, createRatingDto);
  }

  @Get(':recipeId')
  async getRatings(@Param('recipeId') recipeId: string) {
    return this.ratingsService.getRatingsForRecipe(parseInt(recipeId));
  }
}
