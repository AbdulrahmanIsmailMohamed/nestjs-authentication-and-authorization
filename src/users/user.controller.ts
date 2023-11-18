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
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, MongoIdDto, PaginationDto } from './dtos';
import { ParseMongoIdPipe } from 'src/mongo/pipes';
import { Roles } from 'src/auth/decorators';
import { RolesGuard } from 'src/auth/guards';
import Role from 'src/common/enums/roles.enum';
import { User } from './schemas';
import { PaginationResult } from './interfaces';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Partial<User>> {
    const user = await this.userService.createUser(createUserDto);
    if (!user) throw new BadRequestException(`occur error while save user`);
    return user;
  }

  @Get('me')
  async getMe(@Request() req): Promise<User> {
    console.log(req.user);

    return await this.userService.getUser(req.user.id);
  }

  @Get()
  async getUsers(
    @Query() paginationDto: PaginationDto,
    @Query('keyword') keyword: string,
  ): Promise<PaginationResult> {
    const users = await this.userService.getUsers(paginationDto, keyword);
    if (!users) throw new NotFoundException();

    return users;
  }

  @Get(':id')
  async getUser(@Param('id', ParseMongoIdPipe) id: MongoIdDto): Promise<User> {
    const user = await this.userService.getUser(id);
    if (!user) throw new NotFoundException();

    return user;
  }
}
