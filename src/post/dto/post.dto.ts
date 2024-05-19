import { IsDate, IsNumber, IsString, Length } from 'class-validator';

export class PostDto {
  @IsString()
  @Length(3, 20, { message: '标题长度必须在3-20之间' })
  title: string;
  @IsString()
  @Length(3, 200, { message: '内容长度必须在3-200之间' })
  content: string;
}
