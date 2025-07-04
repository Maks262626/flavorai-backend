import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const { access_token } = await this.authService.register(email, password);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, 
    });
    return { access_token };
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response

  ) {
    const { access_token } = await this.authService.login(email, password);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return { access_token };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@GetUser() user: { userId: string; email: string }) {
    return { userId: user.userId, email: user.email };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }
}
