import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dtos/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({});
  }

  async validate(username: string, password: string): Promise<any> {
    const loginDto: LoginDto = {
      email: username,
      password,
    };

    const user = await this.authService.login(loginDto);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
