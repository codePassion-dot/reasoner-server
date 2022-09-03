import { RefreshToken } from 'src/auth/refreshToken.entity';
import { Problem } from 'src/problem/problem.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Connection } from './connection.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
  @Column({ default: '' })
  resetPasswordToken: string;
  @OneToMany(() => Problem, (problem) => problem.user)
  problems: Problem[];
  @OneToMany(() => Connection, (connection) => connection.user)
  connections: Connection[];
}
