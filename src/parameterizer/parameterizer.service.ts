import { BadRequestException, Injectable } from '@nestjs/common';
import { ConnectionOptions } from 'src/users/connection-options.interface';
import { UsersService } from 'src/users/users.service';
import { CreateNewConnectionResponse } from './parameterizer.types';

@Injectable()
export class ParameterizerService {
  constructor(private usersService: UsersService) {}

  async createNewConnection(
    databaseMetaData: Partial<ConnectionOptions>,
    userId: string,
  ): Promise<CreateNewConnectionResponse> {
    const { error, resource } = await this.usersService.createConnection(
      databaseMetaData,
      userId,
    );
    if (!error) {
      return { resource };
    }
    throw new BadRequestException(error);
  }
}
