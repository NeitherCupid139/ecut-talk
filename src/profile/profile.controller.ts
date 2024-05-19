import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dto/profile.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { JWTService } from 'src/jwt/jwt.service';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly jwtService: JWTService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  getProfile(@Req() req: Request) {
    // 从请求头中获取token
    const token = req.headers['authorization'];
    const id = this.jwtService.verifyToken(token).sub;
    return this.profileService.findProfileByUserID(id);
  }

  // 创建用户个人资料
  @Post(':id')
  createProfile(@Param('id') id: number, @Body() profileDto: ProfileDto) {
    return this.profileService.createProfile(+id, profileDto);
  }

  // 根据用户id更新用户个人资料
  @Put()
  @UseGuards(AuthGuard)
  update(@Req() req: Request, @Body() profileDto: ProfileDto) {
    const token = req.headers['authorization'];
    const id = this.jwtService.verifyToken(token).sub;
    return this.profileService.updateProfile(id, profileDto);
  }
}
