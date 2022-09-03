import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { ConnectionOptions } from 'src/users/connection-options.interface';

@Injectable()
export class DatabaseService {
  constructor() {}

  async getDatabaseInstance(
    options: Partial<ConnectionOptions>,
  ): Promise<{ resource: Client; error: { code: string; message: string } }> {
    const { username, port, ...rest } = options;
    const client = new Client({ ...rest, user: username, port: Number(port) });
    try {
      await client.connect();
      return { resource: client, error: null };
    } catch (err) {
      return {
        resource: null,
        error: { code: 'connection_refused', message: 'Connection refused' },
      };
    }
  }
}
