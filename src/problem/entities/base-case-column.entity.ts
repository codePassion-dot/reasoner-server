import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LiteralValue } from './literal-value.entity';
import { MappedValue } from './mapped-value.entity';
import { Problem } from './problem.entity';

@Entity()
export class BaseCaseColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  name: string;
  @Column({ enum: ['predicting-factors', 'goal-factor'] })
  target: string;
  @Column({
    enum: ['ordinal', 'boolean', 'numeric', 'literal'],
    nullable: true,
  })
  type: string;
  @ManyToOne(() => Problem, (problem) => problem.columns)
  problem: Problem;
  @OneToMany(() => MappedValue, (mappedValue) => mappedValue.baseCaseColumn)
  mappedValues: MappedValue[];
  @OneToMany(() => LiteralValue, (literalValue) => literalValue.baseCaseColumn)
  literalValues: LiteralValue[];
}
