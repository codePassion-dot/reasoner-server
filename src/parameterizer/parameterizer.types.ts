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
