import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'src/connection/connection.entity';
import { SaveProblemSourceColumnsDto } from 'src/parameterizer/dtos/save-problem-source-columns';
import { ProblemSource } from 'src/parameterizer/parameterizer.types';
import { User } from 'src/users/user.entity';
import { BaseCaseColumn } from './entities/base-case-column.entity';
import { Problem } from './entities/problem.entity';
import { BaseCaseColumns } from './repositories/base-case-column.repository';
import { ProblemsRepository } from './repositories/problems.repository';

@Injectable()
export class ProblemService {
  constructor(
    @InjectRepository(Problem) private problemsRepository: ProblemsRepository,
    @InjectRepository(BaseCaseColumn)
    private baseCaseColumnsRepository: BaseCaseColumns,
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

  async saveProblemSourceColumns(
    problem: Problem,
    problemSourceSections: SaveProblemSourceColumnsDto[],
  ): Promise<any> {
    for (const section of problemSourceSections) {
      for (const option of section.options) {
        const columnToSave = new BaseCaseColumn();
        columnToSave.name = option;
        columnToSave.target = section.droppableId;
        columnToSave.problem = problem;
        await this.baseCaseColumnsRepository.save(columnToSave);
      }
    }
    const result = await this.problemsRepository.findOne({
      where: { id: problem.id },
      relations: ['columns'],
    });
    return { resource: result };
  }
}
