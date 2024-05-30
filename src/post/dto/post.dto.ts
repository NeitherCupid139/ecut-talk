import { IsDate, IsNumber, IsString, Length } from 'class-validator';

export class PostDto {
  @IsString({ message: '标题必须是字符串' })
  @Length(3, 20, { message: '标题长度必须在3-20之间' })
  title: string;
  @IsString({ message: '内容必须是字符串' })
  @Length(3, 200, { message: '内容长度必须在3-200之间' })
  content: string;
}
