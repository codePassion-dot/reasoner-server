import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Algorithm } from './entities/algorithm.entity';
import { BaseCaseColumn } from './entities/base-case-column.entity';
import { LiteralValue } from './entities/literal-value.entity';
import { MappedValue } from './entities/mapped-value.entity';
import { Problem } from './entities/problem.entity';
import { Registry } from './entities/registry.entity';
import { ProblemService } from './problem.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Problem,
      BaseCaseColumn,
      MappedValue,
      Registry,
      Algorithm,
      LiteralValue,
    ]),
  ],
  providers: [ProblemService],
  exports: [ProblemService],
})
export class ProblemModule {}
