import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'src/connection/connection.entity';
import { ProblemSource } from 'src/parameterizer/parameterizer.types';
import { User } from 'src/users/user.entity';
import { Problem } from './problem.entity';
import { ProblemsRepository } from './problems.repository';

@Injectable()
export class ProblemService {
  constructor(
    @InjectRepository(Problem) private problemsRepository: ProblemsRepository,
  ) {}

  async createProblem(
    connection: Partial<Connection>,
    user: User,
  ): Promise<Problem> {
    const problem = this.problemsRepository.create({ connection, user });
    await this.problemsRepository.save(problem);
    return problem;
  }

  async getProblemBeingCreated(relations: string[]): Promise<Problem> {
    const problem = await this.problemsRepository.findOne({
      where: { isBeingCreated: true },
      relations,
    });
    if (!problem) {
      return null;
    }
    return problem;
  }

  async saveProblemSource(
    problem: Problem,
    problemSource: ProblemSource,
  ): Promise<any> {
    problem = {
      ...problem,
      schema: problemSource.schema,
      table: problemSource.table,
    };
    const result = await this.problemsRepository.save(problem);
    return { resource: result };
  }
}
