import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategyResetPassword extends PassportStrategy(
  Strategy,
  'jwt-reset-password',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_RESET_PASSWORD_SECRET'),
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
    };
  }
}
