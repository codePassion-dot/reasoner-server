import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard([
  'jwt',
  'jwt-reset-password',
  'jwt-refresh-token',
]) {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (info && info[1] instanceof JsonWebTokenError) {
      throw new UnauthorizedException({
        error: { code: 'unauthorized', detail: info[1].message },
      });
    }
    return super.handleRequest(err, user, info, context, status);
  }
}
