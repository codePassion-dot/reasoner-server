import { IsBoolean, IsString } from 'class-validator';

export class CreateConnectionOptionsDto {
  @IsString()
  host: string;

  @IsString()
  port: string;

  @IsString()
  database: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsBoolean()
  ssl: boolean;
}
