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
import { CreateNewConnectionResponse } from './parameterizer.types';
import { SaveProblemSourceDto } from './dtos/save-problem-source.dto';
import { Problem } from 'src/problem/problem.entity';

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

  @Patch('save-problem-source')
  async saveProblemSource(
    @Body() body: SaveProblemSourceDto,
  ): Promise<Problem> {
    return this.parameterizerService.saveProblemSource(body);
  }

  @Get('problem-source-columns')
  async getProblemSourceColumns(): Promise<{
    resource: string[];
  }> {
    return this.parameterizerService.getProblemSourceColumns();
  }
}
