import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from './problem.entity';
import { ProblemService } from './problem.service';

@Module({
  imports: [TypeOrmModule.forFeature([Problem])],
  providers: [ProblemService],
  exports: [ProblemService],
})
export class ProblemModule {}
