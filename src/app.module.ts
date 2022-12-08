import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RefreshToken } from './auth/refreshToken.entity';
import { User } from './users/user.entity';
import { UserModule } from './users/users.module';
import { SendgridService } from './sendgrid/sendgrid.service';
import { SendgridModule } from './sendgrid/sendgrid.module';
import { DatabaseModule } from './database/database.module';
import { ParameterizerModule } from './parameterizer/parameterizer.module';
import { ProblemModule } from './problem/problem.module';
import { Problem } from './problem/entities/problem.entity';
import { ConnectionModule } from './connection/connection.module';
import { Connection } from './connection/connection.entity';
import { SolverModule } from './solver/solver.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required().default('localhost'),
        DB_PORT: Joi.number().required().default(5432),
        DB_USER: Joi.string().required().default('admin'),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required().default('reasoner'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, RefreshToken, Connection, Problem],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    UserModule,
    SendgridModule,
    DatabaseModule,
    ParameterizerModule,
    ProblemModule,
    ConnectionModule,
    SolverModule,
  ],
  controllers: [AppController],
  providers: [AppService, SendgridService],
})
export class AppModule {}
