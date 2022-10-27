import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConnectionOptions } from 'src/connection/connection-options.interface';
import { ConnectionService } from 'src/connection/connection.service';
import { Algorithm } from 'src/problem/entities/algorithm.entity';
import { BaseCaseColumn } from 'src/problem/entities/base-case-column.entity';
import { Problem } from 'src/problem/entities/problem.entity';
import { ProblemService } from 'src/problem/problem.service';
import { SaveProblemSourceColumnsDto } from './dtos/save-problem-source-columns';
import { SaveProblemSourceColumnsTypeDto } from './dtos/save-problem-source-columns-types.dto';
import {
  CreateNewConnectionResponse,
  NewRegistry,
  ProblemSource,
  ProblemSourceColumn,
  ProblemSourceMappedColumns,
  ProblemSourceSchema,
  ProblemSourceTable,
  ProbleSourceSelectedColumnsNewProblem,
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
  ): Promise<{ resource: Problem }> {
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
    const resource = await this.problemService.saveProblemSourceColumns(
      problem,
      columns,
    );
    return resource;
  }

  async getProblemSourceSelectedColumns(): Promise<{
    resource: { columnName: string }[];
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
    const resource = await this.problemService.getProblemSourceSelectedColumns(
      problem,
    );
    return resource;
  }

  async saveProblemSourceColumnsTypes(
    columns: SaveProblemSourceColumnsTypeDto[],
  ): Promise<{ resource: Problem }> {
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
    const resource = await this.problemService.saveProblemSourceColumnsTypes(
      problem,
      columns,
    );
    return resource;
  }

  async getProblemSourceSelectedOrdinalColumns(): Promise<{
    resource: { columnName: string; values: string[] }[];
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
    const { resource } =
      await this.problemService.getProblemSourceSelectedOrdinalColumns(problem);

    const columns = await this.connectionService.getProblemSourceOrdinalValues(
      problem.connection,
      problem.table,
      problem.schema,
      resource,
    );
    return { resource: columns };
  }

  async saveProblemSourceSelectedOrdinalColumns(
    selectedOrdinalColumns: ProblemSourceMappedColumns,
  ): Promise<{ resource: BaseCaseColumn }> {
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
    const resource =
      await this.problemService.saveProblemSourceSelectedOrdinalColumns(
        problem,
        selectedOrdinalColumns,
      );
    return resource;
  }

  async getProblemSourceSelectedColumnsNewProblem(): Promise<{
    resource: ProbleSourceSelectedColumnsNewProblem[];
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
    const resource =
      await this.problemService.getProblemSourceSelectedColumnsNewProblem(
        problem,
      );
    return resource;
  }

  async saveNewRegistrySelectedColumns(
    selectedValues: NewRegistry[],
  ): Promise<{ resource: Problem }> {
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
    const resource = await this.problemService.saveNewRegistrySelectedColumns(
      problem,
      selectedValues,
    );
    return resource;
  }

  async getAvailableAlgorithms(): Promise<{ resource: Algorithm[] }> {
    const resource = await this.problemService.getAvailableAlgorithms();
    return resource;
  }

  async saveProblemAlgorithm(
    algorithm: string,
  ): Promise<{ resource: Problem }> {
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
    const resource = await this.problemService.saveProblemAlgorithm(
      problem,
      algorithm,
    );
    return resource;
  }
}
