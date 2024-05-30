import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
import { JWTService } from 'src/jwt/jwt.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly jwtService: JWTService,
  ) {}

  // 创建评论
  @Post('/:postId')
  @UseGuards(AuthGuard)
  create(
    @Param('postId') postId: number,
    @Req() req: Request,
    @Body() commentDto: CommentDto,
  ) {
    const token = req.headers['authorization'];
    const id = this.jwtService.verifyToken(token).sub;
    return this.commentService.createComment(+postId, id, commentDto);
  }

  // 根据帖子id查找评论
  @Get('/:postId')
  findCommentsByPostId(@Param('postId') postId: number) {
    return this.commentService.findCommentsByPostId(+postId);
  }
}
