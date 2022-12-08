import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { ProblemModule } from 'src/problem/problem.module';
import { UserModule } from 'src/users/users.module';
import { Connection } from './connection.entity';
import { ConnectionService } from './connection.service';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    ProblemModule,
    TypeOrmModule.forFeature([Connection]),
  ],
  providers: [ConnectionService],
  exports: [ConnectionService],
})
export class ConnectionModule {}
