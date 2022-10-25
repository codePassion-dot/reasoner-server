import { Client } from 'pg';
import { Connection } from 'src/connection/connection.entity';
import { User } from 'src/users/user.entity';

export interface CreateNewConnectionResponse {
  resource: {
    connection: Connection;
    problem: {
      id: string;
      connection: Partial<Connection>;
      user: Partial<User>;
    };
  };
}

export interface CreateNewConnectionResponseWithError
  extends CreateNewConnectionResponse {
  error: { code: string; detail: string };
}

export interface DatabaseInstance {
  resource: Client;
  error: { code: string; detail: string };
}

export interface ProblemSource {
  schema: string;
  table: string;
}

export interface ProblemSourceSchema {
  schemaName: string;
}

export interface ProblemSourceTable {
  tableName: string;
}

export interface ProblemSourceColumn {
  columnName: string;
}

export interface ProblemSourceMappedColumns {
  [key: string]: { ordinalValue: string; mappedValue: number }[];
}

export interface NewRegistry {
  columnName: string;
  value: string | number;
}

export interface ProbleSourceSelectedColumnsNewProblem {
  columnName: string;
  type: string;
  options: string[];
}
