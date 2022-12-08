import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendgridModule } from 'src/sendgrid/sendgrid.module';
import { UserModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategyRefreshToken } from './jwt-refresh-token.strategy';
import { JwtStrategyResetPassword } from './jwt-reset-password.strategy';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { RefreshToken } from './refreshToken.entity';
import { RefreshTokensRepository } from './refreshTokens.repository';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule,
    TypeOrmModule.forFeature([RefreshToken]),
    SendgridModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategyRefreshToken,
    JwtStrategyResetPassword,
    JwtStrategy,
    RefreshTokensRepository,
  ],
})
export class AuthModule {}
