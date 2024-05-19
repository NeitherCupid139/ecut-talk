import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';
import { JWTModule } from 'src/jwt/jwt.module';

@Module({
  imports: [UserModule, JWTModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
