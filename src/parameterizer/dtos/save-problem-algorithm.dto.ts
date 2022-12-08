import { IsString } from 'class-validator';

export class SaveProblemAlgorithmDto {
  @IsString()
  algorithmName: string;
}
