import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { CreateUserDto } from './create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async signUp(@Body() body: CreateUserDto): Promise<{
    error: { code: string; detail: string };
    resource: Partial<User>;
  }> {
    const { resource } = await this.authService.signUp(body);
    return { error: null, resource };
  }
}
