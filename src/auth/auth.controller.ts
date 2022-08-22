import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request as RequestType } from 'express';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { CreateUserDto } from './create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() body: CreateUserDto): Promise<{
    error: { code: string; detail: string };
    resource: Partial<User>;
  }> {
    const { resource } = await this.authService.signUp(body);

    return { error: null, resource };
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(
    @Request() req: RequestType & { user: User },
    @Res({ passthrough: true }) response: Response,
  ) {
    const { resource } = await this.authService.signIn(req.user);
    const { refreshToken, ...rest } = resource;
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      domain: this.configService.get('FRONTEND_DOMAIN'),
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    return { error: null, resource: rest };
  }

  @UseGuards(JwtAuthGuard)
  @Get('refresh-token')
  async refreshToken(
    @Request()
    req: RequestType & {
      user: { userId: string; clientRefreshToken: string };
    } & {
      error: { code: string; detail: string };
    },
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user } = req;
    response.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    if (req.error) {
      // if reuse detected
      return response.status(401).json(req.error);
    }
    const { resource } = await this.authService.refreshToken(
      user.userId,
      user.clientRefreshToken,
    );
    const { refreshToken, ...rest } = resource;
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      domain: this.configService.get('FRONTEND_DOMAIN'),
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    response.status(202).json({ error: null, resource: rest });
  }

  @Get('recover-password')
  async recoverPassword(
    @Query('email') email: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ error: { code: string; detail: string } }> {
    const { statusCode, error } = await this.authService.recoverPassword(email);
    response.status(statusCode).json(error ?? { error: null });
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('reset-password')
  async resetPassword(
    @Body('password') password: string,
    @Query('token') resetPasswordToken: string,
    @Request()
    req: RequestType & { user: { userId: string; resetPasswordToken: string } },
  ): Promise<{
    resource: Partial<User> | null;
  }> {
    const { user } = req;
    const { resource } = await this.authService.resetPassword(
      user.userId,
      password,
      resetPasswordToken,
    );
    return { resource };
  }
}
