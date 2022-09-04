import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findOneBy(
    property: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<User | null> {
    return this.usersRepository.findOneBy(property);
  }

  createQueryBuilder(alias: string) {
    return this.usersRepository.createQueryBuilder(alias);
  }

  async findOne(options: FindOneOptions<User>): Promise<User | null> {
    return this.usersRepository.findOne(options);
  }
  create(payload: { email: string; password: string }): User {
    return this.usersRepository.create(payload);
  }
  async save(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }
}
