import { Injectable, NotFoundException } from '@nestjs/common';
import { deepCompare } from 'simple-deepcompare';
import { ConnectionService } from 'src/connection/connection.service';
import { Algorithm } from 'src/problem/entities/algorithm.entity';
import { ProblemService } from 'src/problem/problem.service';
import { RemoteBaseCasesConnection, SolverResult } from './solver.types';

@Injectable()
export class SolverService {
  ACCEPTANCE_UMBRAL = 0.8;
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

    const { nearestNeighbor, similitude } = await this.getNearestNeighbor(
      normalizedBaseCases,
      normalizedNewCase,
      remoteBaseCasesConnection,
      algorithm.name === 'manhattan-distance'
        ? (
            caseBaseFactorX: number,
            newCaseFactorY: number,
            rMax: number,
            rMin: number,
          ) => 1 - Math.abs((caseBaseFactorX - newCaseFactorY) / (rMax + rMin))
        : (caseBaseFactorX: number, newCaseFactorY: number) =>
            Math.sqrt(Math.pow(caseBaseFactorX - newCaseFactorY, 2)),
    );

    const result = this.getOriginalCase(
      normalizedBaseCases,
      allBaseCases,
      nearestNeighbor,
    );

    return {
      resource: {
        initialProblem: problem.registries,
        umbral: {
          acceptanceUmbral: this.ACCEPTANCE_UMBRAL,
          similitude,
        },
        result,
      },
    };
  }

  getOriginalCase(
    normalizedBaseCases: Record<string, number | string>[],
    baseCases: Record<string, number | string>[],
    normalizedTarget: Record<string, number | string>,
  ) {
    const { globalSimilitude, ...rest } = normalizedTarget;

    const index = normalizedBaseCases.findIndex((baseCase) =>
      deepCompare(baseCase, rest),
    );
    const result = { ...baseCases[index], globalSimilitude };
    return result;
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
  ): Promise<{
    nearestNeighbor: Record<string, string | number>;
    similitude: number;
  }> {
    const globalSimilitudes = await Promise.all(
      normalizedBaseCases.map(async (baseCase) =>
        Object.entries(baseCase).reduce(
          async (accPromise, [columnName, columnValue]) => {
            const newCaseColumnValue = normalizedNewCase[columnName];
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
              ); // local similitude
              return {
                ...acc,
                [columnName]: distance,
                globalSimilitude: Number(acc.globalSimilitude) + distance,
              };
            }
            return {
              ...acc,
              [columnName]: columnValue,
              globalSimilitude:
                Number(acc.globalSimilitude) +
                (newCaseColumnValue === columnValue ? 0 : 1), // literal values
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

    const { isAcceptable, similitude } = this.getSimilitude(nearestNeighbor);

    if (isAcceptable) {
      return { nearestNeighbor, similitude };
    }
    throw new NotFoundException({
      error: {
        code: 'no_nearest_neighbor_found',
        detail: 'No nearest neighbor was found',
      },
      resource: null,
    });
  }

  getSimilitude(nearestNeighbor: {
    [key: string]: string | number;
    globalSimilitude: number;
  }) {
    const errorUmbral = 1 - this.ACCEPTANCE_UMBRAL;

    const similitudeLimit = Math.fround(
      Object.keys(nearestNeighbor).reduce((acc, curr) => {
        if (curr !== 'globalSimilitude') {
          return acc + 1;
        }
        return acc;
      }, 0) * errorUmbral,
    );
    const isAcceptable = nearestNeighbor.globalSimilitude <= similitudeLimit;

    const similitude =
      1 - (errorUmbral * nearestNeighbor.globalSimilitude) / similitudeLimit;

    return { isAcceptable, similitude };
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
      if (algorithmName === 'euclidean-distance') {
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
