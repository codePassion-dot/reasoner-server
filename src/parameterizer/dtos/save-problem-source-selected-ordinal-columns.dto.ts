import { IsObject } from 'class-validator';

export class SaveProblemSourceSelectedOrdinalColumns {
  @IsObject()
  selectedOrdinalColumns: Record<
    string,
    { ordinalValue: string; mappedValue: number }[]
  >;
}
