import { Repository } from 'typeorm';
import { Algorithm } from '../entities/algorithm.entity';

export class AlgorithmsRepository extends Repository<Algorithm> {}
