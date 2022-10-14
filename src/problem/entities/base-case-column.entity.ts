import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Problem } from './problem.entity';

@Entity()
export class BaseCaseColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  name: string;
  @Column({ enum: ['predicting-factors', 'goal-factor'] })
  target: string;
  @Column({ enum: ['ordinal', 'boolean', 'numeric'], nullable: true })
  type: string;
  @ManyToOne(() => Problem, (problem) => problem.columns)
  problem: Problem;
}
