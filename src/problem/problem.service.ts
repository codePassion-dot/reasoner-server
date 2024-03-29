import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'src/connection/connection.entity';
import { SaveProblemSourceColumnsDto } from 'src/parameterizer/dtos/save-problem-source-columns';
import {
  NewRegistry,
  ProblemSource,
  ProblemSourceMappedColumns,
  ProbleSourceSelectedColumnsNewProblem,
  SaveProblemSourceColumnsType,
} from 'src/parameterizer/parameterizer.types';
import { User } from 'src/users/user.entity';
import { In, Not, ObjectLiteral } from 'typeorm';
import { BaseCaseColumn } from './entities/base-case-column.entity';
import { MappedValue } from './entities/mapped-value.entity';
import { Registry } from './entities/registry.entity';
import { Problem } from './entities/problem.entity';
import { BaseCaseColumns } from './repositories/base-case-column.repository';
import { MappedValuesRepository } from './repositories/mapped-values.repository';
import { ProblemsRepository } from './repositories/problems.repository';
import { Algorithm } from './entities/algorithm.entity';
import { AlgorithmsRepository } from './repositories/algorithms.repository';
import { LiteralValue } from './entities/literal-value.entity';
import { LiteralValuesRepository } from './repositories/literal-values.repository';
import { RegistriesRepository } from './repositories/registries.repository';

@Injectable()
export class ProblemService {
  constructor(
    @InjectRepository(Problem) private problemsRepository: ProblemsRepository,
    @InjectRepository(BaseCaseColumn)
    private baseCaseColumnsRepository: BaseCaseColumns,
    @InjectRepository(MappedValue)
    private MappedValues: MappedValuesRepository,
    @InjectRepository(Registry)
    private registriesRepository: RegistriesRepository,
    @InjectRepository(Algorithm)
    private algorithmsRepository: AlgorithmsRepository,
    @InjectRepository(LiteralValue)
    private literalValuesRepository: LiteralValuesRepository,
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
    await this.baseCaseColumnsRepository.delete({ problem });

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
      where: { problem, target: Not('goal-factor') },
    });
    const result = columns.map(({ name }) => ({ columnName: name }));
    return { resource: result };
  }

  async getProblemSourceSelectedColumnsNewProblem(
    problem: Problem,
  ): Promise<{ resource: ProbleSourceSelectedColumnsNewProblem[] }> {
    const columns = await this.baseCaseColumnsRepository.find({
      where: { problem, target: Not('goal-factor') },
      relations: ['mappedValues', 'literalValues'],
    });
    const result = columns.map(
      ({ name, type, mappedValues, literalValues }) => {
        const base = {
          columnName: name,
          type,
          options: mappedValues.map(({ ordinalValue }) => ordinalValue),
        };
        if (type === 'boolean-columns') {
          return {
            ...base,
            options: ['true', 'false'],
          };
        }
        if (type === 'literal-columns') {
          return {
            ...base,
            options: literalValues.map(({ value }) => value),
          };
        }
        return base;
      },
    );
    return { resource: result };
  }

  async saveProblemSourceColumnsTypes(
    problem: Problem,
    problemSourceColumns: SaveProblemSourceColumnsType[],
  ): Promise<any> {
    for (const section of problemSourceColumns) {
      for (const option of section.options) {
        const column = await this.baseCaseColumnsRepository.findOne({
          where: { name: option, problem },
        });
        await this.literalValuesRepository.delete({ baseCaseColumn: column });
        column.type = section.droppableId;
        await this.baseCaseColumnsRepository.save(column);
        if (section.droppableId === 'literal-columns') {
          for (const literalValue of section.literalColumns[option]) {
            const literalValueToSave = new LiteralValue();
            literalValueToSave.value = literalValue;
            literalValueToSave.baseCaseColumn = column;
            await this.literalValuesRepository.save(literalValueToSave);
          }
        }
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

  async saveProblemSourceSelectedOrdinalColumns(
    problem: Problem,
    selectedOrdinalColumns: ProblemSourceMappedColumns,
  ): Promise<{ resource: BaseCaseColumn }> {
    const columns = Object.entries(selectedOrdinalColumns);
    for (const [columnName, mappedValues] of columns) {
      const column = await this.baseCaseColumnsRepository.findOne({
        where: { name: columnName, problem },
      });
      await this.MappedValues.delete({ baseCaseColumn: column });
      for (const { ordinalValue, mappedValue } of mappedValues) {
        const mappedValueToSave = new MappedValue();
        mappedValueToSave.baseCaseColumn = column;
        mappedValueToSave.ordinalValue = ordinalValue;
        mappedValueToSave.mappedValue = mappedValue;
        await this.MappedValues.save(mappedValueToSave);
      }
    }
    const result = await this.baseCaseColumnsRepository.findOne({
      where: { problem, name: columns[0][0] },
      relations: ['mappedValues'],
    });
    return { resource: result };
  }

  async saveNewRegistrySelectedColumns(
    problem: Problem,
    newRegistry: NewRegistry[],
  ): Promise<{ resource: Problem }> {
    await this.registriesRepository.delete({ problem });
    for (const entry of newRegistry) {
      const registry = new Registry();
      registry.problem = problem;
      registry.name = entry.columnName;
      registry.value = String(entry.value);
      await this.registriesRepository.save(registry);
    }
    const result = await this.problemsRepository.findOne({
      where: { id: problem.id },
      relations: ['registries'],
    });
    return { resource: result };
  }

  async getAvailableAlgorithms(): Promise<{ resource: Algorithm[] }> {
    const result = await this.algorithmsRepository.find();
    return { resource: result };
  }

  async saveProblemAlgorithm(
    problem: Problem,
    algorithm: string,
  ): Promise<{ resource: Problem }> {
    const algorithmToSave = await this.algorithmsRepository.findOne({
      where: { name: algorithm },
    });
    problem.algorithm = algorithmToSave;
    const result = await this.problemsRepository.save(problem);
    return { resource: result };
  }

  async getBaseColumnMi(
    columnName: string,
  ): Promise<{ resource: { mi: number } }> {
    const column = await this.baseCaseColumnsRepository.findOne({
      where: { name: columnName },
      relations: ['mappedValues'],
    });
    return { resource: { mi: column.mappedValues.length } };
  }

  async getBaseColumnMappedValue(
    columnName: string,
    columnValue: string,
  ): Promise<{ resource: { mappedValue: number } }> {
    const column = await this.baseCaseColumnsRepository.findOne({
      where: { name: columnName },
      relations: ['mappedValues'],
    });
    return {
      resource: {
        mappedValue: column.mappedValues.find(
          ({ ordinalValue }) => ordinalValue === columnValue,
        ).mappedValue,
      },
    };
  }

  async getBaseColumnMappedValues(
    columnName: string,
  ): Promise<{ resource: { mappedValues: MappedValue[] } }> {
    const column = await this.baseCaseColumnsRepository.findOne({
      where: { name: columnName },
      relations: ['mappedValues'],
    });
    return { resource: { mappedValues: column.mappedValues } };
  }

  async getUnfinishedProblems(
    connectionId: string,
  ): Promise<{ resource: Problem[] }> {
    const problems = await this.problemsRepository.find({
      where: { connection: { id: connectionId }, isBeingCreated: true },
    });
    return { resource: problems };
  }

  async convertProblemsToDraft(
    problems: Problem[],
  ): Promise<{ resource: ObjectLiteral[] }> {
    const problemsUpdated = await this.problemsRepository.update(
      { id: In(problems.map(({ id }) => id)) },
      { isBeingCreated: false, draft: true },
    );
    return { resource: problemsUpdated.generatedMaps };
  }
}
