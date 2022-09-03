import { Module } from '@nestjs/common';
import { ProblemService } from './problem.service';

@Module({
  providers: [ProblemService],
  exports: [ProblemService],
})
export class ProblemModule {}
