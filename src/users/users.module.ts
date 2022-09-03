import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { ProblemModule } from 'src/problem/problem.module';
import { Connection } from './connection.entity';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Connection]),
    DatabaseModule,
    ProblemModule,
  ],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UserModule {}
