import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { RefreshToken } from './refreshToken.entity';
import { RefreshTokensRepository } from './refreshTokens.repository';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(RefreshToken)
    private refreshTokensRepository: RefreshTokensRepository,
  ) {}
  async validateUser(
    email: string,
    pass: string,
  ): Promise<Partial<User> | null> {
    const user = await this.usersService.findOneBy({ email });
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async signUp({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{
    resource: Partial<User> | null;
  }> {
    const user = await this.usersService.findOneBy({ email });
    if (user) {
      throw new BadRequestException({
        error: {
          code: 'email_already_exists',
          detail: 'email already exists',
        },
        resource: null,
      });
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = this.usersService.create({
      email,
      password: hashedPassword,
    });
    await this.usersService.save(newUser);
    return { resource: { id: newUser.id, email: newUser.email } };
  }
  async signIn(user: User): Promise<{
    error: null | { code: string; detail: string };
    resource: {
      accessToken: string;
      refreshToken: string;
    };
  }> {
    const payload = { email: user.email, sub: user.id };
    const newRefreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
    const newAccessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    });
    const newRefreshTokenEntity = this.refreshTokensRepository.create({
      user,
      refreshToken: newRefreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    await this.refreshTokensRepository.save(newRefreshTokenEntity);
    return {
      error: null,
      resource: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  }
  async refreshToken(oldRefreshToken: string): Promise<{
    error: null | { code: string; detail: string };
    resource: {
      accessToken: string;
      refreshToken: string;
    };
  }> {
    const foundUser = await this.usersService.findByRefreshToken(
      oldRefreshToken,
    );

    // Detected refresh token reuse we should remove all existing refresh tokens
    if (!foundUser) {
      try {
        const decoded = this.jwtService.verify(oldRefreshToken, {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        });
        const hackedUser = await this.usersService.findOneBy({
          id: decoded.sub,
        });
        await this.refreshTokensRepository.delete({
          user: hackedUser,
        });
        return {
          error: {
            code: 'refresh_token_hacked',
            detail: 'refresh token was hacked',
          },
          resource: null,
        };
      } catch (err) {
        throw new UnauthorizedException({
          error: {
            code: 'refresh_token_invalid',
            detail: 'refresh token invalid',
          },
          resource: null,
        });
      }
    } else {
      // as we are using RTR, we must delete the specific refreshToken from the database
      await this.refreshTokensRepository.delete({
        refreshToken: oldRefreshToken,
      });
      try {
        const decoded = this.jwtService.verify<{
          sub: number;
          email: string;
        }>(oldRefreshToken, {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        });
        const payload = { email: decoded.email, sub: decoded.sub };
        const newRefreshToken = this.jwtService.sign(payload, {
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        });
        const newRefreshTokenEntity = this.refreshTokensRepository.create({
          refreshToken: newRefreshToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          user: foundUser,
        });
        await this.refreshTokensRepository.save(newRefreshTokenEntity);
        const newAccessToken = this.jwtService.sign(payload, {
          expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
          secret: this.configService.get('JWT_ACCESS_SECRET'),
        });
        return {
          error: null,
          resource: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
        };
      } catch (err) {
        throw new UnauthorizedException({
          error: {
            code: 'refresh_token_expired',
            detail: 'refresh token expired, you should sign in again',
          },
          resource: null,
        });
      }
    }
  }
}
