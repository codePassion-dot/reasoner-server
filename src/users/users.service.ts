import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findOneBy(property: any): Promise<User | null> {
    return this.usersRepository.findOneBy(property);
  }

  async findOne(options: FindOneOptions<User>): Promise<User | null> {
    return this.usersRepository.findOne(options);
  }
  async findByRefreshToken(refreshToken: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { refreshTokens: { refreshToken } },
      relations: ['refreshTokens'],
    });
  }

  create(payload: { email: string; password: string }): User {
    return this.usersRepository.create(payload);
  }
  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }
}
