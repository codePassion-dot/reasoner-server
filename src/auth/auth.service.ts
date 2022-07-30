import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(
    email: string,
    pass: string,
  ): Promise<Partial<User> | null> {
    const user = await this.usersService.findOne(email);
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
    const user = await this.usersService.findOneBy(email);
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
    };
  }> {
    const payload = { email: user.email, sub: user.id };
    return {
      error: null,
      resource: {
        accessToken: this.jwtService.sign(payload),
      },
    };
  }
}
