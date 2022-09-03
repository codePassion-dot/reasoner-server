import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateConnectionOptionsDto } from './dtos/create-connection-options.dto';
import { Request as RequestType } from 'express';
import { ParameterizerService } from './parameterizer.service';

@Controller('parameterizer')
export class ParameterizerController {
  constructor(private readonly parameterizerService: ParameterizerService) {}

  @Post('create-connection')
  @UseGuards(JwtAuthGuard)
  async saveConnectionOptions(
    @Body() body: CreateConnectionOptionsDto,
    @Request()
    req: RequestType & { user: { userId: string; username: string } },
  ): Promise<any> {
    const { user } = req;
    return this.parameterizerService.createNewConnection(body, user.userId);
  }
}
