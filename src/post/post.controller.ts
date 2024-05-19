import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  Req,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dto/post.dto';
import { JWTService } from 'src/jwt/jwt.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly jwtService: JWTService,
  ) {}

  // 获取所有文章
  @Get()
  @UseGuards(AuthGuard)
  getAllPosts(@Query('page') page: number) {
    return this.postService.getAllPosts(page);
  }

  // 根据用户id获取文章
  @Get('/user')
  @UseGuards(AuthGuard)
  getAllPostsByUserId(@Req() req: Request) {
    const token = req.headers['authorization'];
    const id = this.jwtService.verifyToken(token).sub;
    return this.postService.getAllPostsByUserId(id);
  }

  // 根据文章id获取文章;
  @Get('id/:id')
  getPostById(@Param('id') id: number) {
    return this.postService.getPostById(+id);
  }

  // 发表帖子
  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  createPost(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() postDto: PostDto,
  ) {
    const fileSize = file.size;
    if (fileSize > 1024 * 1024) {
      throw new BadRequestException('文件过大');
    }
    const token = req.headers['authorization'];
    const id = this.jwtService.verifyToken(token).sub;
    return this.postService.createPost(id, file, postDto);
  }
  //修改文章
  @Put(':postId')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  updatePost(
    @Param('postId') postId: number,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() postDto: PostDto,
  ) {
    const fileSize = file.size;
    if (fileSize > 1024 * 1024) {
      throw new BadRequestException('文件过大');
    }
    const token = req.headers['authorization'];
    const id = this.jwtService.verifyToken(token).sub;
    return this.postService.updatePost(id, +postId, file, postDto);
  }

  // 删除文章
  @Delete(':postId')
  deletePost(@Param('postId') postId: number, @Req() req: Request) {
    const token = req.headers['authorization'];
    const id = this.jwtService.verifyToken(token).sub;
    return this.postService.deletePost(id, +postId);
  }
  // 根据关键字搜索文章
  @Get('/search')
  getPostsBykeyword(@Query('keyword') keyword: string) {
    return this.postService.getPostByKeyword(keyword);
  }
}
