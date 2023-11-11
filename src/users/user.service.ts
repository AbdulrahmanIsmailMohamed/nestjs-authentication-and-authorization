import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, MongoIdDto } from './dtos';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModle: Model<User>) {}

  /**
   * @access admin
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userModle.create(createUserDto);
    return user;
  }

  async getUser(userId: MongoIdDto): Promise<User> {
    const isUserExist = await this.userModle.findById(userId);
    if (!isUserExist) {
      throw new NotFoundException(`${userId} not found`);
    }

    return isUserExist;
  }
}
