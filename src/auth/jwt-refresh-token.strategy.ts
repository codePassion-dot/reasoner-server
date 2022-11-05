import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { RefreshTokensRepository } from './refreshTokens.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtStrategyRefreshToken extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
    private refreshTokensRepository: RefreshTokensRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies.refreshToken,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const clientRefreshToken = req.cookies?.refreshToken;
    const foundUser = await this.usersService.findOne({
      where: {
        id: payload.sub,
      },
      relations: ['refreshTokens'],
    });
    const refreshTokenMatch = foundUser.refreshTokens.some(({ refreshToken }) =>
      bcrypt.compare(clientRefreshToken, refreshToken),
    );
    // Detected refresh token reuse we should remove all existing refresh tokens
    if (!refreshTokenMatch) {
      await this.refreshTokensRepository.delete({
        user: foundUser,
      });
      return {
        error: {
          code: 'refresh_token_hacked',
          detail: 'refresh token was hacked',
        },
        resource: null,
      };
    }
    return {
      userId: payload.sub,
      clientRefreshToken,
    };
  }
}
