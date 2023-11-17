import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos';
import { LoginDto } from './dtos';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto): Promise<string> {
    const user = await this.authService.register(createUserDto);
    if (!user) throw new BadRequestException();

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/me')
  async getMe(@Request() req) {
    return req.user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.login(loginDto);
    if (!user) throw new BadRequestException();

    return user;
  }
}
