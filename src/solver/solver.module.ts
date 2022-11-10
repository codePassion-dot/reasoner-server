import { Module } from '@nestjs/common';
import { SolverService } from './solver.service';
import { SolverController } from './solver.controller';
import { ProblemModule } from 'src/problem/problem.module';
import { ConnectionModule } from 'src/connection/connection.module';

@Module({
  providers: [SolverService],
  controllers: [SolverController],
  imports: [ProblemModule, ConnectionModule],
})
export class SolverModule {}
