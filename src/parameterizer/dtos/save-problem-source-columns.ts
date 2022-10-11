import { IsArray, IsEnum, IsString } from 'class-validator';

export class SaveProblemSourceColumnsDto {
  @IsString()
  sectionTitle: string;
  @IsEnum({
    predictingFactors: 'predicting-factors',
    goalFactor: 'goal-factor',
  })
  droppableId: string;
  @IsArray()
  options: string[];
}
