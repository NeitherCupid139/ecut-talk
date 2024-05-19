import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { get } from 'http';

@Injectable()
export class JWTService {
  constructor(private jwtService: JwtService) {}

  generateToken(payload: any) {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): {
    username: string;
    sub: number;
    iat: number;
    exp: number;
  } {
    return this.jwtService.verify(token);
  }
}
