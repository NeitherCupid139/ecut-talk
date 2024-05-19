import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProfileModule } from 'src/profile/profile.module';
import { JWTModule } from 'src/jwt/jwt.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule, ProfileModule, JWTModule],
  exports: [UserService],
})
export class UserModule {}
