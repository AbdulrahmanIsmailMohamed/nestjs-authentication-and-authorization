import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync, hashSync } from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dtos';
import { User } from 'src/users/schemas/user.schema';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<string> {
    const { password, email } = createUserDto;

    const isEmailUserExist = await this.userModel.findOne({ email });
    if (isEmailUserExist) {
      throw new BadRequestException(
        `Your ${email} is already exist, please login`,
      );
    }

    const hashPassword = hashSync(password, 10);
    delete createUserDto.password;

    const user = await this.userModel.create({
      password: hashPassword,
      ...createUserDto,
    });
    if (!user) throw new BadRequestException();

    return await this.accessToken(user);
  }

  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user || !compareSync(password, user.password)) {
      await this.handleInvalidPassword(user);
    } else {
      user.limit = 0;
      user.ban = false;
      user.banDate = undefined;
      await user.save();
      return await this.accessToken(user);
    }
  }

  private accessToken(user: any): Promise<string> {
    const { _id, username } = user;

    const token = this.jwtService.signAsync({
      _id,
      username,
    });

    return token;
  }

  private async handleInvalidPassword(user: any): Promise<void> {
    console.log(user);
    if (!user) {
      throw new BadRequestException('Invalid emial or password');
    }

    if (user.ban === false) {
      if (user.limit < 3) {
        user.limit += 1;
        await user.save();
        throw new BadRequestException('Invalid email or password');
      } else {
        user.limit = 0;
        user.banDate = Date.now() + 1000 * 60 * 60 * 24;
        user.ban = true;
        await user.save();
        throw new BadRequestException('This person has been blocked');
      }
    } else {
      if (user.banDate > Date.now()) {
        throw new BadRequestException('This person has been blocked');
      } else {
        user.banDate = undefined;
        user.ban = false;
        await user.save();
        throw new BadRequestException('Invalid email or password');
      }
    }
  }
}
