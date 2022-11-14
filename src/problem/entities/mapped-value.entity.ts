import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseCaseColumn } from './base-case-column.entity';
@Entity()
export class MappedValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  ordinalValue: string;
  @Column()
  mappedValue: number;
  @ManyToOne(
    () => BaseCaseColumn,
    (baseCaseColumn) => baseCaseColumn.mappedValues,
    { onDelete: 'CASCADE' },
  )
  baseCaseColumn: BaseCaseColumn;
}
