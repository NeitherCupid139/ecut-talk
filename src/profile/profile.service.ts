import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ProfileDto } from './dto/profile.dto';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prismaService: PrismaService) {}

  // 根据用户ID查找用户个人资料
  async findProfileByUserID(id: number) {
    const profile = await this.prismaService.profile.findUnique({
      where: {
        user_id: id,
      },
    });
    if (!profile) {
      throw new BadRequestException('个人资料不存在');
    }
    return {
      statusCode: HttpStatus.OK,
      message: '查询成功',
      data: {
        avatar: profile.avatar,
        nickname: profile.nickname,
        gender: profile.gender,
        mail: profile.mail,
      },
    };
  }

  // 创建用户个人资料
  createProfile(id: number, profileDto: ProfileDto) {
    if (!this.prismaService.profile.findUnique({ where: { user_id: id } })) {
      throw new BadRequestException('个人资料已经存在');
    }
    return this.prismaService.profile.create({
      data: {
        user_id: id,
        ...profileDto,
      },
    });
  }

  // 根据用户id更新用户个人资料
  async updateProfile(id: number, profileData: ProfileDto) {
    const profile = await this.prismaService.profile.update({
      where: {
        user_id: id,
      },
      data: profileData,
    });
    if (!profile) {
      throw new BadRequestException('更新失败');
    }
    return {
      statusCode: HttpStatus.OK,
      message: '更新成功',
      data: {
        avatar: profile.avatar,
        nickname: profile.nickname,
        gender: profile.gender,
        mail: profile.mail,
      },
    };
  }
}
