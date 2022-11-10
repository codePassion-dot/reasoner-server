import { Connection } from 'src/connection/connection.entity';

export interface RemoteBaseCasesConnection {
  connection: Connection;
  table: string;
  schema: string;
}
