import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async signUp({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{
    resource: Partial<User> | null;
  }> {
    const user = await this.usersRepository.findBy({ email });
    if (user.length) {
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
    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
    });
    await this.usersRepository.save(newUser);
    return { resource: { id: newUser.id, email: newUser.email } };
  }
}
