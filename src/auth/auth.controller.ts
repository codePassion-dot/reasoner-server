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
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response, Request as RequestType } from 'express';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { CreateUserDto } from './create-user.dto';
import { JwtRefreshAuthGuard, JwtResetAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import * as SendGrid from '@sendgrid/mail';
import {
  refreshTokenDescription,
  refreshTokenSuccessfulResponse,
  refreshTokenUnauthorizedResponse,
} from './swagger/refresh-token';
import {
  signInCorrectPayload,
  signInDescription,
  signInSuccessfulResponse,
  signInUnauthorizedResponse,
} from './swagger/sign-in';
import {
  signUpBadRequestResponse,
  signUpCorrectPayload,
  signUpDescription,
  signUpSuccessfulResponse,
} from './swagger/sign-up';
import {
  recovePasswordDescription,
  recoverPasswordBadRequest,
  recoverPasswordSuccessfulResponse,
} from './swagger/recover-password';
import {
  resetPasswordCorrectPayload,
  resetPasswordDescription,
  resetPasswordSuccessfulResponse,
  resetPasswordUnauthorizedResponse,
} from './swagger/reset-password';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @ApiOperation(signUpDescription)
  @ApiResponse(signUpSuccessfulResponse)
  @ApiResponse(signUpBadRequestResponse)
  @ApiBody(signUpCorrectPayload)
  @Post('sign-up')
  async signUp(@Body() body: CreateUserDto): Promise<{
    error: { code: string; detail: string };
    resource: Partial<User>;
  }> {
    const { resource } = await this.authService.signUp(body);

    return { error: null, resource };
  }

  @ApiOperation(signInDescription)
  @ApiResponse(signInSuccessfulResponse)
  @ApiResponse(signInUnauthorizedResponse)
  @ApiBody(signInCorrectPayload)
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
    response.status(202).json({ error: null, resource: rest });
  }

  @ApiOperation(refreshTokenDescription)
  @ApiResponse(refreshTokenSuccessfulResponse)
  @ApiResponse(refreshTokenUnauthorizedResponse)
  @UseGuards(JwtRefreshAuthGuard)
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

  @Get('check-if-logged-in')
  @UseGuards(JwtRefreshAuthGuard)
  async checkIfLoggedIn(
    @Request()
    req: RequestType & {
      user: { userId: string; clientRefreshToken: string };
    } & {
      error: { code: string; detail: string };
    },
  ): Promise<{
    error: { code: string; detail: string } | null;
    resource: { userId: string } | null;
  }> {
    return { error: null, resource: { userId: req.user.userId } };
  }

  @ApiOperation(recovePasswordDescription)
  @ApiResponse(recoverPasswordSuccessfulResponse)
  @ApiResponse(recoverPasswordBadRequest)
  @Get('recover-password')
  async recoverPassword(
    @Query('email') email: string,
    @Res() response: Response,
  ): Promise<{
    error: { code: string; detail: string } | null;
    resource: SendGrid.MailDataRequired;
  }> {
    const { statusCode, error, resource } =
      await this.authService.recoverPassword(email);
    response.status(statusCode).json(error ?? resource);
    return;
  }

  @ApiOperation(resetPasswordDescription)
  @ApiResponse(resetPasswordSuccessfulResponse)
  @ApiResponse(resetPasswordUnauthorizedResponse)
  @ApiBody(resetPasswordCorrectPayload)
  @UseGuards(JwtResetAuthGuard)
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
