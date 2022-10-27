import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Problem } from './problem.entity';

@Entity()
export class Algorithm {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  name: string;
  @Column({ enum: ['ordinal', 'boolean', 'numeric'], nullable: true })
  type: string;
  @OneToMany(() => Problem, (problem) => problem.algorithm)
  problems: Problem;
}
