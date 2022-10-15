import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'src/connection/connection.entity';
import { SaveProblemSourceColumnsDto } from 'src/parameterizer/dtos/save-problem-source-columns';
import { SaveProblemSourceColumnsTypeDto } from 'src/parameterizer/dtos/save-problem-source-columns-types.dto';
import { ProblemSource } from 'src/parameterizer/parameterizer.types';
import { User } from 'src/users/user.entity';
import { Not } from 'typeorm';
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
  ): Promise<{ resource: Problem }> {
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

  async getProblemSourceSelectedColumns(
    problem: Problem,
  ): Promise<{ resource: { columnName: string }[] }> {
    const columns = await this.baseCaseColumnsRepository.find({
      where: { problem, type: Not('goal-factor') },
    });
    const result = columns.map(({ name }) => ({ columnName: name }));
    return { resource: result };
  }

  async saveProblemSourceColumnsTypes(
    problem: Problem,
    problemSourceColumns: SaveProblemSourceColumnsTypeDto[],
  ): Promise<any> {
    for (const section of problemSourceColumns) {
      for (const option of section.options) {
        const column = await this.baseCaseColumnsRepository.findOne({
          where: { name: option, problem },
        });
        column.type = section.droppableId;
        await this.baseCaseColumnsRepository.save(column);
      }
    }
    const result = await this.problemsRepository.findOne({
      where: { id: problem.id },
      relations: ['columns'],
    });
    return { resource: result };
  }

  async getProblemSourceSelectedOrdinalColumns(
    problem: Problem,
  ): Promise<{ resource: { columnName: string }[] }> {
    const columns = await this.baseCaseColumnsRepository.find({
      where: { problem, type: 'ordinal-columns' },
    });
    const result = columns.map(({ name }) => ({ columnName: name }));
    return { resource: result };
  }
}
