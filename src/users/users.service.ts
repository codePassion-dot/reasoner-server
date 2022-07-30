import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findOneBy(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  create(payload: { email: string; password: string }): User {
    return this.usersRepository.create(payload);
  }
  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }
}
