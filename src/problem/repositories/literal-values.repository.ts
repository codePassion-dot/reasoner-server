import { Repository } from 'typeorm';
import { LiteralValue } from '../entities/literal-value.entity';

export class LiteralValuesRepository extends Repository<LiteralValue> {}
