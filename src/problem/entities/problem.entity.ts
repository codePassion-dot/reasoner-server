import { Connection } from 'src/connection/connection.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseCaseColumn } from './base-case-column.entity';
import { Registry } from './registry.entity';

@Entity()
export class Problem {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  name: string;
  @Column({ default: true })
  isBeingCreated: boolean;
  @Column({ nullable: true })
  schema: string;
  @Column({ nullable: true })
  table: string;
  @ManyToOne(() => Connection, (connection) => connection.problems)
  connection: Connection;
  @ManyToOne(() => User, (user) => user.problems)
  user: User;
  @OneToMany(() => BaseCaseColumn, (column) => column.problem)
  columns: BaseCaseColumn[];
  @OneToMany(() => Registry, (registry) => registry.problem)
  registries: Registry[];
}
