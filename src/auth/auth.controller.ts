import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { CreateUserDto } from './create-user.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
  async signIn(@Request() req, @Res({ passthrough: true }) response: Response) {
    const { resource } = await this.authService.signIn(req.user);
    const { refreshToken, ...rest } = resource;
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    response.json({ error: null, resource: rest });
  }
  @Get('refresh-token')
  async refreshToken(
    @Request() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!req.cookies.refreshToken) {
      response.status(401).json({ error: { code: 'refresh_token_missing' } });
      return;
    }
    response.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    const { resource, error } = await this.authService.refreshToken(
      req.cookies.refreshToken,
    );
    if (error) {
      response.status(401).json({ error });
      return;
    }
    const { refreshToken, ...rest } = resource;
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    response.json({ error: null, resource: rest });
  }
}
