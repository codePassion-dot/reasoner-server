import { IsString } from 'class-validator';

export class GetProblemSourceTablesDto {
  @IsString()
  schema: string;
}
