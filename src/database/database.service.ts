import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { DatabaseInstance } from 'src/parameterizer/parameterizer.types';
import { ConnectionOptions } from 'src/users/connection-options.interface';

@Injectable()
export class DatabaseService {
  async getDatabaseInstance(
    options: Partial<ConnectionOptions>,
  ): Promise<DatabaseInstance> {
    const { username, port, ...rest } = options;
    const client = new Client({ ...rest, user: username, port: Number(port) });
    try {
      await client.connect();
      return { resource: client, error: null };
    } catch (err) {
      return {
        resource: null,
        error: { code: 'connection_refused', detail: 'Connection refused' },
      };
    }
  }
}
