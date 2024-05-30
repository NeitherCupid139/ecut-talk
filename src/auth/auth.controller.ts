import {
  Controller,
  Request,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //登录
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() userDto: UserDto): Promise<{
    token: string;
    statusCode: number;
    message: string;
  }> {
    return this.authService.login(userDto);
  }
  //验证jwt
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyToken(@Body('token') token: string) {
    return this.authService.validateUser(token);
  }
}
