import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseService } from 'src/database/database.service';
import {
  CreateNewConnectionResponseWithError,
  ProblemSource,
} from 'src/parameterizer/parameterizer.types';
import { ProblemService } from 'src/problem/problem.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { ConnectionOptions } from './connection-options.interface';
import { Connection } from './connection.entity';

@Injectable()
export class ConnectionService {
  constructor(
    private databaseService: DatabaseService,
    private usersService: UsersService,
    @InjectRepository(Connection)
    private connectionsRepository: Repository<Connection>,
    private problemsService: ProblemService,
  ) {}

  async getConnectionById(connectionId: string): Promise<Connection> {
    const connection = await this.connectionsRepository.findOneBy({
      id: connectionId,
    });

    if (!connection) {
      throw new NotFoundException({
        error: {
          code: 'connection_not_found',
          message: 'Connection not found',
        },
        resource: null,
      });
    }
    return connection;
  }

  async createConnection(
    databaseMetaData: Partial<ConnectionOptions>,
    userId: string,
  ): Promise<CreateNewConnectionResponseWithError> {
    const { error } = await this.databaseService.getDatabaseInstance(
      databaseMetaData,
    );
    if (error) {
      return { error, resource: null };
    }
    const connection = this.connectionsRepository.create(databaseMetaData);
    const user = await this.usersService.findOneBy({ id: userId });
    const { user: _, ...connectionEntity } =
      await this.connectionsRepository.save({
        user,
        ...connection,
      });
    const newProblem = await this.problemsService.createProblem(
      connectionEntity,
      user,
    );
    return {
      resource: {
        connection,
        problem: {
          connection: { id: newProblem.connection.id },
          user: { id: newProblem.user.id },
          id: newProblem.id,
        },
      },
      error: null,
    };
  }

  async checkIfSourceExists(
    problemSource: ProblemSource,
    connectionId: string,
  ): Promise<boolean> {
    const connection = await this.getConnectionById(connectionId);
    const { schema, table } = problemSource;
    const { resource: db, error } =
      await this.databaseService.getDatabaseInstance(connection);
    if (!error) {
      const { rows } = await db.query(
        `SELECT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_schema = '${schema}'
          AND table_name = '${table}'
        );`,
      );
      return rows[0].exists;
    }
    return false;
  }
}
