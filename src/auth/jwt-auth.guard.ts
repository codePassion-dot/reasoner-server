import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

const customResponse = (info: any) => {
  if (info && info.message) {
    throw new UnauthorizedException({
      error: {
        code: 'unauthorized',
        detail: info.message,
      },
    });
  }
};
@Injectable()
export class JwtBaseAuthGuard extends AuthGuard() {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    customResponse(info);
    return super.handleRequest(err, user, info, context, status);
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    customResponse(info);
    return super.handleRequest(err, user, info, context, status);
  }
}

@Injectable()
export class JwtResetAuthGuard extends AuthGuard('jwt-reset-password') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    customResponse(info);
    return super.handleRequest(err, user, info, context, status);
  }
}

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh-token') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    customResponse(info);
    return super.handleRequest(err, user, info, context, status);
  }
}
