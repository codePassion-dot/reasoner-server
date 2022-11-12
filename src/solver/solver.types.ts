import { Connection } from 'src/connection/connection.entity';
import { Registry } from 'src/problem/entities/registry.entity';

export interface RemoteBaseCasesConnection {
  connection: Connection;
  table: string;
  schema: string;
}

export interface SolverResult {
  resource: {
    initialProblem: Registry[];
    umbral: number;
    result: Record<string, string | number>;
  };
}
