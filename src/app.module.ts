import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { RecipesModule } from './recipes/recipes.module';
import { RatingsModule } from './ratings/ratings.module';

@Module({
  imports: [AuthModule, RecipesModule, RatingsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
