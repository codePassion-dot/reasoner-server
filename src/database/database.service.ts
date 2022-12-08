import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { ConnectionOptions } from 'src/connection/connection-options.interface';
import { DatabaseInstance } from 'src/parameterizer/parameterizer.types';

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
