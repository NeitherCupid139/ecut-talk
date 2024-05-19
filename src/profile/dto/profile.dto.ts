import { IsEmail, IsNumber, IsString, Length } from 'class-validator';

export class ProfileDto {
  @IsNumber()
  avatar: number;
  @IsString()
  @Length(4, 10, { message: '昵称长度必须在4到10之间' })
  nickname: string;
  @IsString()
  gender: string;
  @IsEmail({}, { message: '邮箱格式不正确' })
  mail: string;
}
