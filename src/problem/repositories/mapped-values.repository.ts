import { Repository } from 'typeorm';
import { MappedValue } from '../entities/mapped-value.entity';

export class MappedValuesRepository extends Repository<MappedValue> {}
