import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ){}

  async register(email: string, password: string){
    const existingUser = await this.prisma.user.findUnique({where: {email}});
    if(existingUser){
      throw new Error('exmail already exist')
    }

    const hashPassword = await bcrypt.hash(password,10);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashPassword
      }
    })

    const payload = {userId: user.id, email: user.email};
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
  async login(email: string,password: string){
    const user = await this.prisma.user.findUnique({where: {email}});
    if(!user){
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
      throw new UnauthorizedException();
    }

    const payload = { userId: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload)
    };

  }

  async findUserById(userId: number) {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }
}
