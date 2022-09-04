import { Problem } from 'src/problem/problem.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Connection {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  host: string;
  @Column()
  port: string;
  @Column()
  database: string;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  ssl: boolean;
  @Column({ default: true })
  current: boolean;
  @OneToMany(() => Problem, (problem) => problem.connection)
  problems: Problem[];
  @ManyToOne(() => User, (user) => user.connections)
  user: User;
}
