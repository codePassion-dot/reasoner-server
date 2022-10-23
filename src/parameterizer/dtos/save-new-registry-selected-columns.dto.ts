import { IsString } from 'class-validator';

export class SaveNewRegistrySelectedColumnsDto {
  @IsString()
  columnName: string;
  @IsString()
  value: string | number;
}
