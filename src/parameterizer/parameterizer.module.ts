import { Module } from '@nestjs/common';
import { ParameterizerService } from './parameterizer.service';
import { ParameterizerController } from './parameterizer.controller';
import { ConnectionModule } from 'src/connection/connection.module';
import { ProblemModule } from 'src/problem/problem.module';

@Module({
  providers: [ParameterizerService],
  controllers: [ParameterizerController],
  imports: [ConnectionModule, ProblemModule],
})
export class ParameterizerModule {}
