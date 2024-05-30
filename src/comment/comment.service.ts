import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(private prismaService: PrismaService) {}

  // 创建评论
  async createComment(postId: number, id: number, commentDto: CommentDto) {
    const { content } = commentDto;

    const comment = await this.prismaService.comment.create({
      data: {
        content,
        post_id: postId,
        user_id: id,
        created: new Date(),
      },
    });
    if (!comment) {
      throw new HttpException('Comment failed', HttpStatus.BAD_REQUEST);
    }
    return {
      code: HttpStatus.CREATED,
      message: 'Comment created',
    };
  }

  // 根据帖子id查找评论
  async findCommentsByPostId(id: number) {
    return this.prismaService.comment.findMany({
      where: {
        post_id: id,
      },
      include: {
        user: {
          select: {
            profile: {
              select: {
                nickname: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  }
  // 删除某个的帖子的所有评论
  async deleteCommentById(id: number) {
    return this.prismaService.comment.deleteMany({
      where: {
        post_id: id,
      },
    });
  }
}
