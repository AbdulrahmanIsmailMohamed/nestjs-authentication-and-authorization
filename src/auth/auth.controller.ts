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
import { LocalAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto): Promise<string> {
    console.log(createUserDto);

    const user = await this.authService.register(createUserDto);
    console.log(createUserDto);
    if (!user) throw new BadRequestException();

    return user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('/users')
  async getMe(@Request() req) {
    console.log(req.user, 'authenticated user');

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
