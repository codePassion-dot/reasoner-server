import { IsString } from 'class-validator';

export class SaveProblemSourceDto {
  @IsString()
  schema: string;

  @IsString()
  table: string;
}
