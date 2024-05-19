import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostDto } from './dto/post.dto';
import * as fs from 'fs';
import { CommentService } from 'src/comment/comment.service';

@Injectable()
export class PostService {
  constructor(
    private prismaService: PrismaService,
    private commentService: CommentService,
  ) {}

  // 获取某个用户id的所有帖子
  async getAllPostsByUserId(id: number) {
    const post = await this.prismaService.post.findMany({
      where: {
        user_id: id,
      },
    });
    if (!post) throw new BadRequestException('Post not found');
    return post;
  }

  // 获取所有帖子,分页查询
  async getAllPosts(page: number) {
    const pageSize = 10;
    const post = await this.prismaService.post.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
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
    if (!post) throw new BadRequestException('Post not found');
    return {
      statusCode: HttpStatus.OK,
      message: '获取所有帖子成功',
      data: post,
    };
  }
  // 发表帖子
  async createPost(id: number, file: Express.Multer.File, postDto: PostDto) {
    // 图片保存到路径
    const filePath = `./uploads/${file.originalname}`;
    // 将图片保存到指定路径
    fs.writeFileSync(filePath, file.buffer);
    const post = await this.prismaService.post.create({
      data: {
        user_id: id,
        title: postDto.title,
        image: filePath.split('/')[2],
        content: postDto.content,
        created: new Date(),
      },
    });
    if (!post) throw new BadRequestException('创建帖子失败');
    return {
      statusCode: HttpStatus.OK,
      message: '帖子创建成功',
    };
  }

  // 根据id获取帖子
  async getPostById(id: number) {
    const post = await this.prismaService.post.findUnique({
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
      where: {
        post_id: id,
      },
    });
    if (!post) throw new BadRequestException('帖子未找到');
    return {
      statusCode: HttpStatus.OK,
      message: '获取帖子成功',
      data: post,
    };
  }

  // 修改帖子
  async updatePost(
    id: number,
    postId: number,
    file: Express.Multer.File,
    postDto: PostDto,
  ) {
    const post = await this.prismaService.post.findUnique({
      where: {
        post_id: postId,
        user_id: id,
      },
    });
    if (!post) throw new BadRequestException('帖子不存在');
    // 图片保存到路径
    const filePath = `./uploads/${file.originalname}`;
    // 将图片保存到指定路径
    fs.writeFileSync(filePath, file.buffer);
    await this.prismaService.post.update({
      where: {
        post_id: postId,
      },
      data: {
        title: postDto.title,
        image: filePath.split('/')[2],
        content: postDto.content,
      },
    });
    return {
      statusCode: HttpStatus.OK,
      message: '帖子修改成功',
    };
  }

  // 删除帖子
  async deletePost(id: number, postId: number) {
    console.log(id, postId);
    const post = await this.prismaService.post.findUnique({
      where: {
        post_id: postId,
        user_id: id,
      },
    });
    if (!post) throw new BadRequestException('帖子不存在');
    await this.commentService.deleteCommentById(postId);
    await this.prismaService.post.delete({
      where: {
        post_id: postId,
      },
    });
    return {
      statusCode: HttpStatus.OK,
      message: '帖子删除成功',
    };
  }

  // 根据标题关键字搜索帖子
  async getPostByKeyword(keyword: string) {
    const post = await this.prismaService.post.findMany({
      where: {
        title: {
          contains: keyword,
        },
      },
    });
    if (!post) throw new BadRequestException('帖子未找到');
    return post;
  }
}
