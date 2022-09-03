import { Repository } from 'typeorm';
import { Problem } from './problem.entity';

export class ProblemsRepository extends Repository<Problem> {}
