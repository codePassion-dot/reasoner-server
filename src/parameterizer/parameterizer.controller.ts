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
import { Algorithm } from 'src/problem/entities/algorithm.entity';
import { SaveProblemAlgorithmDto } from './dtos/save-problem-algorithm.dto';
import {
  createConnectionBadRequestResponse,
  createConnectionCorrectPayload,
  createConnectionDescription,
  createConnectionSuccessfulResponse,
} from './swagger/create-conection';
import {
  getProblemSourceSchemasBadRequestResponse,
  getProblemSourceSchemasDescription,
  getProblemSourceSchemasSuccessfulResponse,
} from './swagger/get-problem-source-schema';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  getProblemSourceTablesBadRequestResponse,
  getProblemSourceTablesCorrectPayload,
  getProblemSourceTablesDescription,
  getProblemSourceTablesSuccessfulResponse,
} from './swagger/get-problem-source-tables';
import {
  saveProblemSourceBadRequestResponse,
  saveProblemSourceCorrectPayload,
  saveProblemSourceDescription,
  saveProblemSourceSuccessfulResponse,
} from './swagger/save-problem-source';
import {
  problemSourceColumnsBadRequestResponse,
  problemSourceColumnsDescription,
  problemSourceColumnsSuccessfulResponse,
} from './swagger/problem-source-columns';
import {
  saveProblemSourceColumnsBadRequestResponse,
  saveProblemSourceColumnsCorrectPayload,
  saveProblemSourceColumnsDescription,
  saveProblemSourceColumnsSuccessfulResponse,
} from './swagger/save-problem-source-columns';
import {
  getProblemSourceSelectedColumnsBadRequestResponse,
  getProblemSourceSelectedColumnsDescription,
  getProblemSourceSelectedColumnsSuccessfulResponse,
} from './swagger/get-problem-source-selected-columns';
import {
  saveProblemSourceColumnsTypesBadRequestResponse,
  saveProblemSourceColumnsTypesCorrectPayload,
  saveProblemSourceColumnsTypesDescription,
  saveProblemSourceColumnsTypesSuccessfulResponse,
} from './swagger/save-problem-source-columns-types';
import {
  getProblemSourceSelectedOrdinalColumnsBadRequestResponse,
  getProblemSourceSelectedOrdinalColumnsDescription,
  getProblemSourceSelectedOrdinalColumnsSuccessfulResponse,
} from './swagger/get-problem-source-selected-ordinal-columns';
import {
  saveProblemSourceSelectedOrdinalColumnsBadRequestResponse,
  saveProblemSourceSelectedOrdinalColumnsCorrectPayload,
  saveProblemSourceSelectedOrdinalColumnsDescription,
  saveProblemSourceSelectedOrdinalColumnsSuccessfulResponse,
} from './swagger/save-problem-source-selected-ordinal-columns';
import {
  getProblemSourceSelectedColumnsNewProblemBadRequestResponse,
  getProblemSourceSelectedColumnsNewProblemDescription,
  getProblemSourceSelectedColumnsNewProblemSuccessfulResponse,
} from './swagger/get-problem-source-selected-columns-new-problem';
import {
  saveNewRegistrySelectedColumnsBadRequestResponse,
  saveNewRegistrySelectedColumnsCorrectPayload,
  saveNewRegistrySelectedColumnsDescription,
  saveNewRegistrySelectedColumnsSuccessfulResponse,
} from './swagger/save-new-registry-selected-columns';
import {
  getAvailableAlgorithmsBadRequestResponse,
  getAvailableAlgorithmsDescription,
  getAvailableAlgorithmsSuccessfulResponse,
} from './swagger/get-available-algorithms';
import {
  saveProblemAlgorithmBadRequestResponse,
  saveProblemAlgorithmCorrectPayload,
  saveProblemAlgorithmDescription,
  saveProblemAlgorithmSuccessfulResponse,
} from './swagger/save-problem.algorithm';

@UseGuards(JwtAuthGuard)
@Controller('parameterizer')
export class ParameterizerController {
  constructor(private readonly parameterizerService: ParameterizerService) {}

  @ApiOperation(createConnectionDescription)
  @ApiResponse(createConnectionSuccessfulResponse)
  @ApiResponse(createConnectionBadRequestResponse)
  @ApiBody(createConnectionCorrectPayload)
  @Post('create-connection')
  async saveConnectionOptions(
    @Body() body: CreateConnectionOptionsDto,
    @Request()
    req: RequestType & { user: { userId: string; username: string } },
  ): Promise<CreateNewConnectionResponse> {
    const { user } = req;
    return this.parameterizerService.createNewConnection(body, user.userId);
  }

  @ApiOperation(getProblemSourceSchemasDescription)
  @ApiResponse(getProblemSourceSchemasSuccessfulResponse)
  @ApiResponse(getProblemSourceSchemasBadRequestResponse)
  @Get('get-problem-source-schemas')
  async getProblemSourceOptions(): Promise<{
    resource: ProblemSourceSchema[];
  }> {
    return this.parameterizerService.getProblemSourceSchemas();
  }

  @ApiOperation(getProblemSourceTablesDescription)
  @ApiResponse(getProblemSourceTablesSuccessfulResponse)
  @ApiResponse(getProblemSourceTablesBadRequestResponse)
  @ApiBody(getProblemSourceTablesCorrectPayload)
  @Post('get-problem-source-tables')
  async getProblemSourceTables(
    @Body() body: GetProblemSourceTablesDto,
  ): Promise<{
    resource: ProblemSourceTable[];
  }> {
    const { schema } = body;
    return this.parameterizerService.getProblemSourceTables(schema);
  }

  @ApiOperation(saveProblemSourceDescription)
  @ApiResponse(saveProblemSourceSuccessfulResponse)
  @ApiResponse(saveProblemSourceBadRequestResponse)
  @ApiBody(saveProblemSourceCorrectPayload)
  @Patch('save-problem-source')
  async saveProblemSource(
    @Body() body: SaveProblemSourceDto,
  ): Promise<Problem> {
    return this.parameterizerService.saveProblemSource(body);
  }

  @ApiOperation(problemSourceColumnsDescription)
  @ApiResponse(problemSourceColumnsSuccessfulResponse)
  @ApiResponse(problemSourceColumnsBadRequestResponse)
  @Get('problem-source-columns')
  async getProblemSourceColumns(): Promise<{
    resource: ProblemSourceColumn[];
  }> {
    return this.parameterizerService.getProblemSourceColumns();
  }

  @ApiOperation(saveProblemSourceColumnsDescription)
  @ApiResponse(saveProblemSourceColumnsSuccessfulResponse)
  @ApiResponse(saveProblemSourceColumnsBadRequestResponse)
  @ApiBody(saveProblemSourceColumnsCorrectPayload)
  @Post('save-problem-source-columns')
  async saveProblemSourceColumns(
    @Body() body: { sections: SaveProblemSourceColumnsDto[] },
  ): Promise<{ resource: Problem }> {
    const { sections } = body;
    return this.parameterizerService.saveProblemSourceColumns(sections);
  }

  @ApiOperation(getProblemSourceSelectedColumnsDescription)
  @ApiResponse(getProblemSourceSelectedColumnsSuccessfulResponse)
  @ApiResponse(getProblemSourceSelectedColumnsBadRequestResponse)
  @Get('get-problem-source-selected-columns')
  async getProblemSourceSelectedColumns(): Promise<{
    resource: { columnName: string }[];
  }> {
    return this.parameterizerService.getProblemSourceSelectedColumns();
  }

  @ApiOperation(saveProblemSourceColumnsTypesDescription)
  @ApiResponse(saveProblemSourceColumnsTypesSuccessfulResponse)
  @ApiResponse(saveProblemSourceColumnsTypesBadRequestResponse)
  @ApiBody(saveProblemSourceColumnsTypesCorrectPayload)
  @Post('save-problem-source-columns-types')
  async saveProblemSourceColumnsType(
    @Body() body: { sections: SaveProblemSourceColumnsTypeDto[] },
  ): Promise<{ resource: Problem }> {
    const { sections } = body;
    return this.parameterizerService.saveProblemSourceColumnsTypes(sections);
  }

  @ApiOperation(getProblemSourceSelectedOrdinalColumnsDescription)
  @ApiResponse(getProblemSourceSelectedOrdinalColumnsSuccessfulResponse)
  @ApiResponse(getProblemSourceSelectedOrdinalColumnsBadRequestResponse)
  @Get('get-problem-source-selected-ordinal-columns')
  async getProblemSourceSelectedOrdinalColumns(): Promise<{
    resource: { columnName: string; values: string[] }[];
  }> {
    return this.parameterizerService.getProblemSourceSelectedOrdinalColumns();
  }

  @ApiOperation(saveProblemSourceSelectedOrdinalColumnsDescription)
  @ApiResponse(saveProblemSourceSelectedOrdinalColumnsSuccessfulResponse)
  @ApiResponse(saveProblemSourceSelectedOrdinalColumnsBadRequestResponse)
  @ApiBody(saveProblemSourceSelectedOrdinalColumnsCorrectPayload)
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

  @ApiOperation(getProblemSourceSelectedColumnsNewProblemDescription)
  @ApiResponse(getProblemSourceSelectedColumnsNewProblemSuccessfulResponse)
  @ApiResponse(getProblemSourceSelectedColumnsNewProblemBadRequestResponse)
  @Get('get-problem-source-selected-columns-new-problem')
  async getProblemSourceSelectedColumnsNewProblem(): Promise<{
    resource: ProbleSourceSelectedColumnsNewProblem[];
  }> {
    return this.parameterizerService.getProblemSourceSelectedColumnsNewProblem();
  }

  @ApiOperation(saveNewRegistrySelectedColumnsDescription)
  @ApiResponse(saveNewRegistrySelectedColumnsSuccessfulResponse)
  @ApiResponse(saveNewRegistrySelectedColumnsBadRequestResponse)
  @ApiBody(saveNewRegistrySelectedColumnsCorrectPayload)
  @Post('save-new-registry-selected-columns')
  async saveNewProblemSelectedColumns(
    @Body() body: SaveNewRegistrySelectedColumnsDto[],
  ): Promise<{ resource: Problem }> {
    return this.parameterizerService.saveNewRegistrySelectedColumns(body);
  }

  @ApiOperation(getAvailableAlgorithmsDescription)
  @ApiResponse(getAvailableAlgorithmsSuccessfulResponse)
  @ApiResponse(getAvailableAlgorithmsBadRequestResponse)
  @Get('get-available-algorithms')
  async getAvailableAlgorithms(): Promise<{ resource: Algorithm[] }> {
    return this.parameterizerService.getAvailableAlgorithms();
  }

  @ApiOperation(saveProblemAlgorithmDescription)
  @ApiResponse(saveProblemAlgorithmSuccessfulResponse)
  @ApiResponse(saveProblemAlgorithmBadRequestResponse)
  @ApiBody(saveProblemAlgorithmCorrectPayload)
  @Post('save-problem-algorithm')
  async saveProblemAlgorithm(
    @Body() body: SaveProblemAlgorithmDto,
  ): Promise<{ resource: Problem }> {
    const { algorithmName } = body;
    return this.parameterizerService.saveProblemAlgorithm(algorithmName);
  }
}
