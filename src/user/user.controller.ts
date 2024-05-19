import { ProfileDto } from './../profile/dto/profile.dto';
import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  createUser(@Body() data: { userDto: UserDto; profileDto: ProfileDto }) {
    const { userDto, profileDto } = data;
    return this.userService.createUser(userDto, profileDto);
  }
  // 根据用户名查找用户
  @Get(':username')
  @UseGuards(AuthGuard)
  getUser(@Param('username') username: string) {
    return this.userService.findProfileByUsername(username);
  }
}
