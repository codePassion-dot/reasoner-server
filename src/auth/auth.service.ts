import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { RefreshToken } from './refreshToken.entity';
import { RefreshTokensRepository } from './refreshTokens.repository';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private sendgridService: SendgridService,
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

  async createNewRefreshToken(user: User): Promise<string> {
    const refreshTokenPayload = {
      sub: user.id,
    };
    const newRefreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
    const salt = await bcrypt.genSalt();
    const hashedToken = await bcrypt.hash(newRefreshToken, salt);
    const newRefreshTokenEntity = this.refreshTokensRepository.create({
      user,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      refreshToken: hashedToken,
    });
    await this.refreshTokensRepository.save(newRefreshTokenEntity);
    return newRefreshToken;
  }

  createNewAccessToken(user: User): string {
    const accessTokenPayload = { email: user.email, sub: user.id };
    const newAccessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    });
    return newAccessToken;
  }

  async signIn(user: User): Promise<{
    error: null | { code: string; detail: string };
    resource: {
      accessToken: string;
      refreshToken: string;
    };
  }> {
    const newAccessToken = this.createNewAccessToken(user);
    const newRefreshToken = await this.createNewRefreshToken(user);
    return {
      error: null,
      resource: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  }

  async refreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<{
    resource: {
      accessToken: string;
      refreshToken: string;
    };
  }> {
    // as we are using RTR, we must delete the specific refreshToken from the database
    await this.refreshTokensRepository.delete({
      refreshToken,
    });
    const user = await this.usersService.findOneBy({ id: userId });
    const newAccessToken = this.createNewAccessToken(user);
    const newRefreshToken = await this.createNewRefreshToken(user);
    return {
      resource: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  }

  async recoverPassword(email: string): Promise<{
    error: null | { code: string; detail: string };
    statusCode: number;
  }> {
    const user = await this.usersService.findOneBy({ email });
    if (!user) {
      throw new BadRequestException({
        error: {
          code: 'user_not_found',
          detail: 'user not found',
        },
      });
    }
    const resetTokenPayload = { sub: user.id };
    const resetToken = this.jwtService.sign(resetTokenPayload, {
      secret: this.configService.get('JWT_RESET_PASSWORD_SECRET'),
      expiresIn: this.configService.get('JWT_RESET_PASSWORD_EXPIRATION_TIME'),
    });
    const salt = await bcrypt.genSalt();
    const hashedResetToken = await bcrypt.hash(resetToken, salt);
    user.resetPasswordToken = hashedResetToken;
    await this.usersService.save(user); // update if the user exists
    const mail: SendGrid.MailDataRequired = {
      to: email,
      from: 'hrivera@unal.edu.co',
      subject: 'Password recovery',
      templateId: 'd-7a7e65ab6bf44627bea5758e97fbb969',
      personalizations: [
        {
          to: [
            {
              email,
            },
          ],
          dynamicTemplateData: {
            link: `${this.configService.get(
              'FRONTEND_URL',
            )}/reset-password?token=${resetToken}`,
          },
        },
      ],
    };
    const { error, statusCode } = await this.sendgridService.send(mail);
    return {
      error,
      statusCode,
    };
  }

  async resetPassword(
    userId: string,
    newPassword: string,
    clientResetPasswordToken: string,
  ): Promise<{
    resource: Partial<User>;
  }> {
    const user = await this.usersService.findOneBy({ id: userId });
    // get out of here motherfucker
    if (!user) {
      throw new BadRequestException({
        error: {
          code: 'user_not_found',
          detail: 'user not found',
        },
        resource: null,
      });
    }
    if (
      !(await bcrypt.compare(clientResetPasswordToken, user.resetPasswordToken))
    ) {
      throw new BadRequestException({
        error: {
          code: 'reset_password_token_invalid_payload',
          detail: 'reset password token invalid payload',
        },
        resource: null,
      });
    }
    // create new hash for the new password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;

    user.resetPasswordToken = '';
    await this.usersService.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return {
      resource: rest,
    };
  }
}
