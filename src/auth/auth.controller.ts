import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
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
  async signIn(@Request() req) {
    return this.authService.signIn(req.user);
  }
}
