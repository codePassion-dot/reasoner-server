import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateConnectionOptionsDto } from './dtos/create-connection-options.dto';
import { Request as RequestType } from 'express';
import { ParameterizerService } from './parameterizer.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  CreateNewConnectionResponse,
  ProblemSourceColumn,
  ProblemSourceSchema,
  ProblemSourceTable,
} from './parameterizer.types';
import { SaveProblemSourceDto } from './dtos/save-problem-source.dto';
import { Problem } from 'src/problem/problem.entity';
import { GetProblemSourceTablesDto } from './dtos/get-problem-source-tables';

@UseGuards(JwtAuthGuard)
@Controller('parameterizer')
export class ParameterizerController {
  constructor(private readonly parameterizerService: ParameterizerService) {}

  @Post('create-connection')
  async saveConnectionOptions(
    @Body() body: CreateConnectionOptionsDto,
    @Request()
    req: RequestType & { user: { userId: string; username: string } },
  ): Promise<CreateNewConnectionResponse> {
    const { user } = req;
    return this.parameterizerService.createNewConnection(body, user.userId);
  }

  @Get('get-problem-source-schemas')
  async getProblemSourceOptions(): Promise<{
    resource: ProblemSourceSchema[];
  }> {
    return this.parameterizerService.getProblemSourceSchemas();
  }

  @Post('get-problem-source-tables')
  async getProblemSourceTables(
    @Body() body: GetProblemSourceTablesDto,
  ): Promise<{
    resource: ProblemSourceTable[];
  }> {
    const { schema } = body;
    return this.parameterizerService.getProblemSourceTables(schema);
  }

  @Patch('save-problem-source')
  async saveProblemSource(
    @Body() body: SaveProblemSourceDto,
  ): Promise<Problem> {
    return this.parameterizerService.saveProblemSource(body);
  }

  @Get('problem-source-columns')
  async getProblemSourceColumns(): Promise<{
    resource: ProblemSourceColumn[];
  }> {
    return this.parameterizerService.getProblemSourceColumns();
  }
}
