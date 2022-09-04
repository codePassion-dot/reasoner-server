import { Connection } from 'src/connection/connection.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}
