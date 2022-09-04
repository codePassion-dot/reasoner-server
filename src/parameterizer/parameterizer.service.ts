import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConnectionOptions } from 'src/connection/connection-options.interface';
import { ConnectionService } from 'src/connection/connection.service';
import { Problem } from 'src/problem/problem.entity';
import { ProblemService } from 'src/problem/problem.service';
import {
  CreateNewConnectionResponse,
  ProblemSource,
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
}
