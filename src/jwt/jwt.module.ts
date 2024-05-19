import { Module } from '@nestjs/common';
import { JWTService } from './jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'ecut',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [JWTService],
  exports: [JWTService],
})
export class JWTModule {}
