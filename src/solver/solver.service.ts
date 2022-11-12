import { Injectable, NotFoundException } from '@nestjs/common';
import { ConnectionService } from 'src/connection/connection.service';
import { Algorithm } from 'src/problem/entities/algorithm.entity';
import { ProblemService } from 'src/problem/problem.service';
import { RemoteBaseCasesConnection, SolverResult } from './solver.types';

@Injectable()
export class SolverService {
  constructor(
    private problemService: ProblemService,
    private connectionService: ConnectionService,
  ) {}

  async solve(): Promise<SolverResult> {
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
    //
    const columnTypes = columns
      .filter((column) => column.target !== 'goal-factor')
      .map(({ name, type }) => ({
        columnName: name,
        columnType: type,
      }));
    // all the base cases fetched from the remote database
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
      const nearestNeighbor = await this.getNearestNeighbor(
        normalizedBaseCases,
        normalizedNewCase,
        remoteBaseCasesConnection,
        (caseBaseFactorX: number, newCaseFactorY: number) =>
          Math.sqrt(Math.pow(caseBaseFactorX - newCaseFactorY, 2)),
      );
      return {
        resource: {
          initialProblem: problem.registries,
          umbral: 0.8,
          result: nearestNeighbor,
        },
      };
    } else if (algorithm.name === 'manhattan-distance') {
      const nearestNeighbor = await this.getNearestNeighbor(
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
      return {
        resource: {
          initialProblem: problem.registries,
          umbral: 0.8,
          result: nearestNeighbor,
        },
      };
    }
  }

  async getMinAndMax(
    columnName: string,
    remoteBaseCasesConnection: RemoteBaseCasesConnection,
  ) {
    const {
      resource: { mappedValues },
    } = await this.problemService.getBaseColumnMappedValues(columnName);
    if (mappedValues.length) {
      return mappedValues.reduce(
        (acc: { min: number; max: number }, { mappedValue }) => {
          if (mappedValue < acc.min) {
            acc.min = mappedValue;
          }
          if (mappedValue > acc.max) {
            acc.max = mappedValue;
          }
          return acc;
        },
        { min: Infinity, max: -Infinity },
      );
    } else {
      const {
        resource: { min, max },
      } = await this.connectionService.getNumericColumnMinMax({
        ...remoteBaseCasesConnection,
        columnName,
      });
      return { min, max };
    }
  }

  async getNearestNeighbor(
    normalizedBaseCases: Record<string, number | string>[],
    normalizedNewCase: Record<string, number | string>,
    remoteBaseCasesConnection: RemoteBaseCasesConnection,
    distanceFunction: (
      caseBaseFactorX: number,
      newCaseFactorY: number,
      rMax?: number,
      rMin?: number,
    ) => number,
  ): Promise<Record<string, string | number>> {
    const [, newCaseColumnValue] = Object.entries(normalizedNewCase)[0];
    const globalSimilitudes = await Promise.all(
      normalizedBaseCases.map(async (baseCase) =>
        Object.entries(baseCase).reduce(
          async (accPromise, [columnName, columnValue]) => {
            const { min, max } = await this.getMinAndMax(
              columnName,
              remoteBaseCasesConnection,
            );
            const acc = await accPromise;
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
              return {
                ...acc,
                [columnName]: distance,
                globalSimilitude: Number(acc.globalSimilitude) + distance,
              };
            }
            return {
              ...acc,
              [columnName]: columnValue,
              globalSimilitude: Number(acc.globalSimilitude),
            };
          },
          Promise.resolve({
            [Object.keys(baseCase)[0]]: baseCase[Object.keys(baseCase)[0]],
            globalSimilitude: 0,
          }),
        ),
      ),
    );

    const nearestNeighbor = globalSimilitudes.reduce((acc, curr) =>
      acc.globalSimilitude < curr.globalSimilitude ? acc : curr,
    );

    const isAcceptable =
      nearestNeighbor.globalSimilitude <=
      Object.keys(nearestNeighbor).reduce((acc, curr) => {
        if (curr !== 'globalSimilitude') {
          return acc + 1;
        }
        return acc;
      }, 0) *
        0.2;

    if (isAcceptable) {
      return nearestNeighbor;
    }
    throw new NotFoundException({
      error: {
        code: 'no_nearest_neighbor_found',
        detail: 'No nearest neighbor was found',
      },
      resource: null,
    });
  }

  async normalizeBaseCases(
    columnTypes: { columnName: string; columnType: string }[],
    allBaseCases: Record<string, string>[],
    algorithm: Algorithm,
    remoteBaseCasesConnection: RemoteBaseCasesConnection,
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
    remoteBaseCasesConnection: RemoteBaseCasesConnection,
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
    remoteBaseCasesConnection: RemoteBaseCasesConnection,
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
