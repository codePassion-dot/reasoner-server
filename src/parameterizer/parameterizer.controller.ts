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
  ProbleSourceSelectedColumnsNewProblem,
} from './parameterizer.types';
import { SaveProblemSourceDto } from './dtos/save-problem-source.dto';
import { Problem } from 'src/problem/entities/problem.entity';
import { GetProblemSourceTablesDto } from './dtos/get-problem-source-tables';
import { SaveProblemSourceColumnsDto } from './dtos/save-problem-source-columns';
import { SaveProblemSourceColumnsTypeDto } from './dtos/save-problem-source-columns-types.dto';
import { SaveProblemSourceSelectedOrdinalColumns } from './dtos/save-problem-source-selected-ordinal-columns.dto';
import { BaseCaseColumn } from 'src/problem/entities/base-case-column.entity';
import { SaveNewRegistrySelectedColumnsDto } from './dtos/save-new-registry-selected-columns.dto';

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

  @Post('save-problem-source-columns')
  async saveProblemSourceColumns(
    @Body() body: { sections: SaveProblemSourceColumnsDto[] },
  ): Promise<{ resource: Problem }> {
    const { sections } = body;
    return this.parameterizerService.saveProblemSourceColumns(sections);
  }

  @Get('get-problem-source-selected-columns')
  async getProblemSourceSelectedColumns(): Promise<{
    resource: { columnName: string }[];
  }> {
    return this.parameterizerService.getProblemSourceSelectedColumns();
  }

  @Post('save-problem-source-columns-types')
  async saveProblemSourceColumnsType(
    @Body() body: { sections: SaveProblemSourceColumnsTypeDto[] },
  ): Promise<{ resource: Problem }> {
    const { sections } = body;
    return this.parameterizerService.saveProblemSourceColumnsTypes(sections);
  }

  @Get('get-problem-source-selected-ordinal-columns')
  async getProblemSourceSelectedOrdinalColumns(): Promise<{
    resource: { columnName: string; values: string[] }[];
  }> {
    return this.parameterizerService.getProblemSourceSelectedOrdinalColumns();
  }

  @Post('save-problem-source-selected-ordinal-columns')
  async saveProblemSourceSelectedOrdinalColumns(
    @Body()
    body: SaveProblemSourceSelectedOrdinalColumns,
  ): Promise<{ resource: BaseCaseColumn }> {
    const { selectedOrdinalColumns } = body;
    return this.parameterizerService.saveProblemSourceSelectedOrdinalColumns(
      selectedOrdinalColumns,
    );
  }

  @Get('get-problem-source-selected-columns-new-problem')
  async getProblemSourceSelectedColumnsNewProblem(): Promise<{
    resource: ProbleSourceSelectedColumnsNewProblem[];
  }> {
    return this.parameterizerService.getProblemSourceSelectedColumnsNewProblem();
  }

  @Post('save-new-registry-selected-columns')
  async saveNewProblemSelectedColumns(
    @Body() body: SaveNewRegistrySelectedColumnsDto[],
  ): Promise<{ resource: Problem }> {
    return this.parameterizerService.saveNewRegistrySelectedColumns(body);
  }
}
