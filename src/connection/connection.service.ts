import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseService } from 'src/database/database.service';
import {
  CreateNewConnectionResponseWithError,
  ProblemSource,
  ProblemSourceColumn,
  ProblemSourceSchema,
  ProblemSourceTable,
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

  async getProblemSourceSchemas(
    connection: Connection,
  ): Promise<ProblemSourceSchema[]> {
    const { resource: db, error } =
      await this.databaseService.getDatabaseInstance(connection);
    if (!error) {
      const { rows } = await db.query(
        `SELECT schema_name
        FROM information_schema.schemata
        WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast');`,
      );
      return rows.map((row) => ({
        schemaName: row.schema_name,
      }));
    }
    return null;
  }

  async getProblemSourceTables(
    connection: Connection,
    schema: string,
  ): Promise<ProblemSourceTable[]> {
    const { resource: db, error } =
      await this.databaseService.getDatabaseInstance(connection);
    if (!error) {
      const { rows } = await db.query(
        `SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = '${schema}';`,
      );
      return rows.map((row) => ({ tableName: row.table_name }));
    }
    return [];
  }

  async getCurrentProblemSourceColumns(
    connection: Connection,
    table: string,
    schema: string,
  ): Promise<ProblemSourceColumn[]> {
    const { resource: db, error } =
      await this.databaseService.getDatabaseInstance(connection);
    if (!error) {
      const { rows } = await db.query(
        `SELECT column_name FROM information_schema.columns WHERE table_name = '${table}' AND table_schema = '${schema}';`,
      );
      return rows.map((row) => ({ columnName: row.column_name }));
    }
    return [];
  }

  async getProblemSourceOrdinalValues(
    connection: Connection,
    table: string,
    schema: string,
    columnNames: { columnName: string }[],
  ): Promise<{ columnName: string; values: string[] }[]> {
    const { resource: db, error } =
      await this.databaseService.getDatabaseInstance(connection);
    const columns = [];
    if (!error) {
      for (const { columnName } of columnNames) {
        const { rows } = await db.query(
          `SELECT DISTINCT ${columnName} FROM ${schema}.${table};`,
        );
        columns.push({
          columnName,
          values: rows.map((row) => row[columnName]),
        });
      }
    }
    return columns;
  }
}
