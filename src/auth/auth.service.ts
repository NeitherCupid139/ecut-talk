import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserDto } from 'src/user/dto/user.dto';
import { JWTService } from 'src/jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JWTService,
  ) {}

  async login(userDto: UserDto): Promise<{
    token: string;
    statusCode: number;
    message: string;
  }> {
    const { username, password } = userDto;
    const user = await this.userService.findUserByUsername(username);
    const isPasswordValid = await bcrypt.compare(password, user.password); //验证密码
    if (!isPasswordValid) {
      throw new HttpException('密码错误', HttpStatus.UNAUTHORIZED);
    }
    const payload = { username: user.username, sub: user.user_id };
    return {
      token: this.jwtService.generateToken(payload),
      statusCode: HttpStatus.OK,
      message: '登录成功',
    };
  }

  async validateUser(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, 'ecut');
      console.log(decoded);
      return {
        statusCode: HttpStatus.OK,
        message: '验证成功',
      };
    } catch (error) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
