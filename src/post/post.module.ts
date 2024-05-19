import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProfileModule } from 'src/profile/profile.module';
import { JWTModule } from 'src/jwt/jwt.module';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [PrismaModule, ProfileModule, JWTModule, CommentModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
