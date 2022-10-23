import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Problem } from './problem.entity';

@Entity()
export class Registry {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  name: string;
  @Column({ default: true })
  value: string;
  @ManyToOne(() => Problem, (problem) => problem.registries)
  problem: Problem;
}
