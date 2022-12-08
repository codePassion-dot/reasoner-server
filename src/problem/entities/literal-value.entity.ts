import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseCaseColumn } from './base-case-column.entity';

@Entity()
export class LiteralValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  value: string;
  @ManyToOne(
    () => BaseCaseColumn,
    (baseCaseColumn) => baseCaseColumn.literalValues,
    { onDelete: 'CASCADE' },
  )
  baseCaseColumn: BaseCaseColumn;
}
