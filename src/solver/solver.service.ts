import { Injectable, NotFoundException } from '@nestjs/common';
import { Connection } from 'src/connection/connection.entity';
import { ConnectionService } from 'src/connection/connection.service';
import { Algorithm } from 'src/problem/entities/algorithm.entity';
import { ProblemService } from 'src/problem/problem.service';

@Injectable()
export class SolverService {
  constructor(
    private problemService: ProblemService,
    private connectionService: ConnectionService,
  ) {}

  async solve(): Promise<any> {
    const problem = await this.problemService.getProblemBeingCreated([
      'columns',
      'connection',
      'algorithm',
      'registries',
    ]);
    const { columns, connection, table, schema, algorithm, registries } =
      problem;
    if (!problem) {
      throw new NotFoundException({
        error: {
          code: 'no_problem_being_created',
          detail: 'No problem is being created',
        },
        resource: null,
      });
    }
    // type for each base case identified by column name
    const columnTypes = columns.map((column) => ({
      columnName: column.name,
      columnType: column.type,
    }));
    // all the base cases fetched fromt the remote database
    const allBaseCases = await this.connectionService.getAllRows(
      connection,
      table,
      schema,
    );
    const formattedBaseCases = allBaseCases.map((baseCase) =>
      Object.entries(baseCase)
        .filter(([columnName]) => {
          const { target } = columns.find(
            (column) => column.name === columnName,
          );
          return target !== 'goal-factor';
        })
        .reduce(
          (acc, [columnName, columnValue]) => ({
            ...acc,
            [columnName]: columnValue,
          }),
          {},
        ),
    );

    const remoteBaseCasesConnection = { connection, table, schema };
    const normalizedBaseCases = await this.normalizeBaseCases(
      columnTypes,
      formattedBaseCases,
      algorithm,
      remoteBaseCasesConnection,
    );

    const formattedNewCase = registries.reduce(
      (acc, registry) => ({
        ...acc,
        [registry.name]: registry.value,
      }),
      {},
    );

    const normalizedNewCase = await this.normalizeRow(
      formattedNewCase,
      columnTypes,
      algorithm.name,
      remoteBaseCasesConnection,
    );

    if (algorithm.name === 'euclidian-distance') {
      this.getNearestNeighbor(
        normalizedBaseCases,
        normalizedNewCase,
        remoteBaseCasesConnection,
        (caseBaseFactorX: number, newCaseFactorY: number) =>
          Math.sqrt(Math.pow(caseBaseFactorX - newCaseFactorY, 2)),
      );
    } else if (algorithm.name === 'manhattan-distance') {
      this.getNearestNeighbor(
        normalizedBaseCases,
        normalizedNewCase,
        remoteBaseCasesConnection,
        (
          caseBaseFactorX: number,
          newCaseFactorY: number,
          rMax: number,
          rMin: number,
        ) => 1 - Math.abs((caseBaseFactorX - newCaseFactorY) / (rMax + rMin)),
      );
    }
  }

  async getNearestNeighbor(
    normalizedBaseCases: Record<string, number | string>[],
    normalizedNewCase: Record<string, number | string>,
    remoteBaseCasesConnection: {
      connection: Connection;
      table: string;
      schema: string;
    },
    distanceFunction: (
      caseBaseFactorX: number,
      newCaseFactorY: number,
      rMax?: number,
      rMin?: number,
    ) => number,
  ) {
    const [, newCaseColumnValue] = Object.entries(normalizedNewCase)[0];
    return Promise.all(
      normalizedBaseCases.map(async (baseCase) => {
        const [columnName, columnValue] = Object.entries(baseCase)[0];
        const {
          resource: { min, max },
        } = await this.connectionService.getNumericColumnMinMax({
          ...remoteBaseCasesConnection,
          columnName,
        });
        if (
          typeof columnValue === 'number' &&
          typeof newCaseColumnValue === 'number'
        ) {
          const distance = distanceFunction(
            columnValue,
            newCaseColumnValue,
            max,
            min,
          );
          return { ...baseCase, distance };
        }
      }),
    );
  }

  async normalizeBaseCases(
    columnTypes: { columnName: string; columnType: string }[],
    allBaseCases: Record<string, string>[],
    algorithm: Algorithm,
    remoteBaseCasesConnection: {
      connection: Connection;
      table: string;
      schema: string;
    },
  ): Promise<Record<string, number | string>[]> {
    return Promise.all(
      allBaseCases.map(async (baseCase) => {
        const normalizedValue = await this.normalizeRow(
          baseCase,
          columnTypes,
          algorithm.name,
          remoteBaseCasesConnection,
        );
        return normalizedValue;
      }),
    );
  }

  async normalizeRow(
    baseCase: Record<string, string>,
    columnTypes: { columnName: string; columnType: string }[],
    algorithmName: string,
    remoteBaseCasesConnection: {
      connection: Connection;
      table: string;
      schema: string;
    },
  ): Promise<any> {
    const normalizedBaseCase = {};
    for (const [columnName, columnValue] of Object.entries(baseCase)) {
      const { columnType } = columnTypes.find(
        (column) => column.columnName === columnName,
      );
      const normalizedValue = await this.normalizeFactor(
        columnType,
        columnName,
        columnValue,
        algorithmName,
        remoteBaseCasesConnection,
      );
      Object.assign(normalizedBaseCase, normalizedValue);
    }
    return normalizedBaseCase;
  }

  async normalizeFactor(
    columnType: string,
    columnName: string,
    columnValue: string,
    algorithmName: string,
    remoteBaseCasesConnection: {
      connection: Connection;
      table: string;
      schema: string;
    },
  ) {
    if (columnType === 'ordinal-columns') {
      const {
        resource: { mi: Mi },
      } = await this.problemService.getBaseColumnMi(columnName);
      const {
        resource: { mappedValue },
      } = await this.problemService.getBaseColumnMappedValue(
        columnName,
        columnValue,
      );
      const normalizedValue = (mappedValue - 1) / (Mi - 1);
      return { [columnName]: normalizedValue };
    }

    if (columnType === 'numeric-columns') {
      if (algorithmName === 'euclidian-distance') {
        const {
          resource: { min, max },
        } = await this.connectionService.getNumericColumnMinMax({
          ...remoteBaseCasesConnection,
          columnName,
        });
        const normalizedValue = (Number(columnValue) - min) / (max - min);

        return { [columnName]: normalizedValue };
      }
      return { [columnName]: Number(columnValue) };
    }
    if (columnType === 'boolean-columns') {
      return { [columnName]: columnValue ? 1 : 0 };
    }
    return { [columnName]: columnValue };
  }
}
