import { IsString, Length } from 'class-validator';

export class UserDto {
  @IsString()
  @Length(6, 15, { message: '用户名长度必须在6-15之间' })
  username: string;
  @IsString()
  @Length(8, 20, { message: '密码长度必须在8-20之间' })
  password: string;
}
