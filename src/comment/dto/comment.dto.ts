import { IsString, IsNumber, IsDate } from 'class-validator';

export class CommentDto {
  @IsString()
  content: string;
}
