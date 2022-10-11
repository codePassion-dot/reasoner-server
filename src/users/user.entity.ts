import { RefreshToken } from 'src/auth/refreshToken.entity';
import { Connection } from 'src/connection/connection.entity';
import { Problem } from 'src/problem/entities/problem.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
  @OneToMany(() => Problem, (problem) => problem.user, { cascade: true })
  problems: Problem[];
  @OneToMany(() => Connection, (connection) => connection.user, {
    cascade: true,
  })
  connections: Connection[];
}
