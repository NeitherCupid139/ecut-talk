import { ProfileService } from './../profile/profile.service';
import {
  BadRequestException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ProfileDto } from 'src/profile/dto/profile.dto';
@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private profileService: ProfileService,
  ) {}

  // 创建用户
  async createUser(userDto: UserDto, profileDto: ProfileDto) {
    if (
      await this.prismaService.user.findUnique({
        where: { username: userDto.username },
      })
    ) {
      throw new BadRequestException('用户名已存在');
    }
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const user: {
      user_id: number;
      username: string;
      password: string;
    } = await this.prismaService.user.create({
      data: {
        username: userDto.username,
        password: hashedPassword,
      },
    });
    await this.profileService.createProfile(user.user_id, profileDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: '用户创建成功',
    };
  }
  // 根据用户名查找用户
  async findUserByUsername(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    return user;
  }
  // 根据id查找用户profile的nickname
  async findNicknameByUserID(user_id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { user_id },
    });
    return await this.profileService.findProfileByUserID(user.user_id);
  }

  // 根据用户名查找用户的profile
  async findProfileByUsername(username: string) {
    const user = await this.findUserByUsername(username);
    return this.profileService.findProfileByUserID(user.user_id);
  }
}
