import { Connection } from 'src/users/connection.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Problem {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  host: string;
  @Column()
  port: number;
  @Column()
  database: string;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  ssl: boolean;
  @Column()
  current: boolean;
  @ManyToOne(() => Connection, (connection) => connection.problems)
  connection: Connection;
  @ManyToOne(() => User, (user) => user.problems)
  user: User;
}
