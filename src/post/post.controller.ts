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

  // 获取所有帖子
  @Get()
  @UseGuards(AuthGuard)
  getAllPosts(@Query('page') page: number) {
    return this.postService.getAllPosts(page);
  }

  // 根据用户id获取帖子
  @Get('/user')
  @UseGuards(AuthGuard)
  getAllPostsByUserId(@Req() req: Request) {
    const token = req.headers['authorization'];
    const id = this.jwtService.verifyToken(token).sub;
    return this.postService.getAllPostsByUserId(id);
  }

  // 根据帖子id获取帖子;
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

  // 修改帖子
  @Put(':postId')
  @HttpCode(HttpStatus.OK)
  updatePost(
    @Param('postId') postId: number,
    @Req() req: Request,
    @Body() postDto: PostDto,
  ) {
    const token = req.headers['authorization'];
    const id = this.jwtService.verifyToken(token).sub;
    return this.postService.updatePost(id, +postId, postDto);
  }

  //修改帖子带图片
  @Put('/image/:postId')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  updatePostWithImage(
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
    return this.postService.updatePostWithImage(id, +postId, file, postDto);
  }

  // 删除帖子
  @Delete(':postId')
  deletePost(@Param('postId') postId: number, @Req() req: Request) {
    const token = req.headers['authorization'];
    const id = this.jwtService.verifyToken(token).sub;
    return this.postService.deletePost(id, +postId);
  }
  // 根据关键字搜索帖子
  @Get('/search')
  getPostsBykeyword(@Query('keyword') keyword: string) {
    return this.postService.getPostByKeyword(keyword);
  }
}
