import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConnectionOptions } from 'src/connection/connection-options.interface';
import { ConnectionService } from 'src/connection/connection.service';
import { Problem } from 'src/problem/entities/problem.entity';
import { ProblemService } from 'src/problem/problem.service';
import { SaveProblemSourceColumnsDto } from './dtos/save-problem-source-columns';
import {
  CreateNewConnectionResponse,
  ProblemSource,
  ProblemSourceColumn,
  ProblemSourceSchema,
  ProblemSourceTable,
} from './parameterizer.types';

@Injectable()
export class ParameterizerService {
  constructor(
    private connectionService: ConnectionService,
    private problemService: ProblemService,
  ) {}

  async createNewConnection(
    databaseMetaData: Partial<ConnectionOptions>,
    userId: string,
  ): Promise<CreateNewConnectionResponse> {
    const { error, resource } = await this.connectionService.createConnection(
      databaseMetaData,
      userId,
    );
    if (!error) {
      return { resource };
    }
    throw new BadRequestException(error);
  }

  async getProblemSourceSchemas(): Promise<{
    resource: ProblemSourceSchema[];
  }> {
    const problem = await this.problemService.getProblemBeingCreated([
      'connection',
    ]);
    if (!problem) {
      throw new NotFoundException({
        error: {
          code: 'no_problem_being_created',
          detail: 'No problem is being created',
        },
        resource: null,
      });
    }
    const { connection } = problem;
    const schemas = await this.connectionService.getProblemSourceSchemas(
      connection,
    );
    if (!schemas.length) {
      throw new NotFoundException({
        error: {
          code: 'schemas_not_found',
          detail: 'Schemas not found',
        },
        resource: null,
      });
    }
    return { resource: schemas };
  }

  async getProblemSourceTables(
    schema: string,
  ): Promise<{ resource: ProblemSourceTable[] }> {
    const problem = await this.problemService.getProblemBeingCreated([
      'connection',
    ]);
    if (!problem) {
      throw new NotFoundException({
        error: {
          code: 'no_problem_being_created',
          detail: 'No problem is being created',
        },
        resource: null,
      });
    }
    const { connection } = problem;
    const tables = await this.connectionService.getProblemSourceTables(
      connection,
      schema,
    );
    if (!tables.length) {
      throw new NotFoundException({
        error: {
          code: 'tables_not_found',
          detail: 'Tables not found',
        },
        resource: null,
      });
    }
    return { resource: tables };
  }

  async saveProblemSource(problemSource: ProblemSource): Promise<Problem> {
    const problem = await this.problemService.getProblemBeingCreated([
      'connection',
    ]);
    if (!problem) {
      throw new NotFoundException({
        error: {
          code: 'no_problem_being_created',
          detail: 'No problem is being created',
        },
        resource: null,
      });
    }
    const problemSourceExists =
      await this.connectionService.checkIfSourceExists(
        problemSource,
        problem.connection.id,
      );
    if (!problemSourceExists) {
      throw new BadRequestException({
        error: {
          code: 'source_not_found',
          message: 'Source not found',
        },
        resource: null,
      });
    }
    const { resource } = await this.problemService.saveProblemSource(
      problem,
      problemSource,
    );
    return resource;
  }

  async getProblemSourceColumns(): Promise<{
    resource: ProblemSourceColumn[];
  }> {
    const problem = await this.problemService.getProblemBeingCreated([
      'connection',
    ]);
    if (!problem) {
      throw new NotFoundException({
        error: {
          code: 'no_problem_being_created',
          detail: 'No problem is being created',
        },
        resource: null,
      });
    }
    const { connection, table, schema } = problem;

    const columns = await this.connectionService.getCurrentProblemSourceColumns(
      connection,
      table,
      schema,
    );

    if (!columns.length) {
      throw new NotFoundException({
        error: {
          code: 'columns_not_found',
          detail: 'Columns not found',
        },
        resource: null,
      });
    }
    return {
      resource: columns,
    };
  }

  async saveProblemSourceColumns(
    columns: SaveProblemSourceColumnsDto[],
  ): Promise<Problem> {
    const problem = await this.problemService.getProblemBeingCreated([
      'connection',
    ]);
    if (!problem) {
      throw new NotFoundException({
        error: {
          code: 'no_problem_being_created',
          detail: 'No problem is being created',
        },
        resource: null,
      });
    }
    const { resource } = await this.problemService.saveProblemSourceColumns(
      problem,
      columns,
    );
    return resource;
  }
}
