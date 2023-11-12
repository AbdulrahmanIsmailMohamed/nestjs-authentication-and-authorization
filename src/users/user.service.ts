import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, MongoIdDto, PaginationDto } from './dtos';
import { PaginationResult } from './interfaces';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModle: Model<User>) {}

  /**
   * @access admin
   */
  async createUser(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const user = await this.userModle.create(createUserDto);
    return this.removeSensitiveUserFields(user);
  }

  /**
   * @access User
   */
  async getUser(userId: MongoIdDto): Promise<User> {
    const user = await this.userModle.findById(userId);
    if (!user) {
      throw new NotFoundException(`${userId} not found`);
    }

    return user;
  }

  /**
   * @access User
   */
  async getUsers(
    paginationDto: PaginationDto,
    keyword: string,
  ): Promise<PaginationResult> {
    const users = await this.paginate(paginationDto, keyword);
    if (!users) throw new NotFoundException();

    return users;
  }

  private async paginate(paginationDto: PaginationDto, keyword: string) {
    const { limit, page } = paginationDto;

    const skip = (page - 1) * limit;
    const endIndex: number = page * limit;

    let filters: any = { ban: false };
    if (keyword) {
      filters = {
        $and: [
          { username: { $regex: keyword, $options: 'i' } },
          { ban: false },
        ],
      };
    }

    const users = await this.userModle.find(filters).skip(skip).limit(limit);
    if (!users) throw new NotFoundException();

    const countDocumnet = await this.userModle.countDocuments(filters);
    const paginationResult: PaginationResult = {
      data: users,
      page,
      limit,
    };
    if (endIndex < countDocumnet) paginationResult.nextPage = page + 1;
    if (skip > 0) paginationResult.previousPage = page - 1;

    return paginationResult;
  }

  private removeSensitiveUserFields(user: User): Partial<User> {
    const userSenitize: Partial<User> = {
      username: user.username,
      email: user.email,
      country: user.country,
    };

    return userSenitize;
  }
}
