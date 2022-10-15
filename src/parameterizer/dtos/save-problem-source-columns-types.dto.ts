import { IsArray, IsEnum, IsString } from 'class-validator';

export class SaveProblemSourceColumnsTypeDto {
  @IsString()
  sectionTitle: string;
  @IsEnum({
    ordinalColumns: 'ordinal-columns',
    booleanColumns: 'boolean-columns',
    numericColumns: 'numeric-columns',
  })
  droppableId: string;
  @IsArray()
  options: string[];
}
