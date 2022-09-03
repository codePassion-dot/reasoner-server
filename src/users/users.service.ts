import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseService } from 'src/database/database.service';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { ConnectionOptions } from './connection-options.interface';
import { Connection } from './connection.entity';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Connection)
    private connectionsRepository: Repository<Connection>,
    private databasesService: DatabaseService,
  ) {}

  async findOneBy(
    property: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<User | null> {
    return this.usersRepository.findOneBy(property);
  }

  createQueryBuilder(alias: string) {
    return this.usersRepository.createQueryBuilder(alias);
  }

  async getCaseDatabaseOptions(userId: string): Promise<ConnectionOptions> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['connections'],
    });

    if (!user) {
      throw new Error('No current user');
    }

    const connection = user.connections.find(
      (connection) => connection.current,
    );

    return {
      id: connection.id,
      host: connection.host,
      port: connection.port,
      username: connection.username,
      password: connection.password,
      database: connection.database,
      ssl: connection.ssl,
    };
  }

  async createConnection(
    databaseMetaData: Partial<ConnectionOptions>,
    userId: string,
  ): Promise<any> {
    const { error } = await this.databasesService.getDatabaseInstance(
      databaseMetaData,
    );
    if (error) {
      return { error, resource: null };
    }
    const connection = this.connectionsRepository.create(databaseMetaData);
    const user = await this.usersRepository.findOneBy({ id: userId });
    await this.connectionsRepository.save({ user, ...connection });
    return { resource: connection };
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
