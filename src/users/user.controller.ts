import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, MongoIdDto, PaginationDto } from './dtos';
import { ParseMongoIdPipe } from 'src/mongo/pipes';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    if (!user) throw new BadRequestException(`occur error while save user`);
    return user;
  }

  @Get(':id')
  async getUser(@Param('id', ParseMongoIdPipe) id: MongoIdDto) {
    const user = await this.userService.getUser(id);
    if (!user) throw new NotFoundException();

    return user;
  }

  @Get()
  async getUsers(
    @Query() paginationDto: PaginationDto,
    @Query('keyword') keyword: string,
  ) {
    const users = await this.userService.getUsers(paginationDto, keyword);
    if (!users) throw new NotFoundException();

    return users;
  }
}
