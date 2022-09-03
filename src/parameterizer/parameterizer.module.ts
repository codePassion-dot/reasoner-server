import { Module } from '@nestjs/common';
import { ParameterizerService } from './parameterizer.service';
import { ParameterizerController } from './parameterizer.controller';
import { UserModule } from 'src/users/users.module';

@Module({
  providers: [ParameterizerService],
  controllers: [ParameterizerController],
  imports: [UserModule],
})
export class ParameterizerModule {}
