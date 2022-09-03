import { Connection } from 'src/users/connection.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Problem {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  name: string;
  @Column({ default: true })
  draft: boolean;
  @ManyToOne(() => Connection, (connection) => connection.problems)
  connection: Connection;
  @ManyToOne(() => User, (user) => user.problems)
  user: User;
}
