import { Repository } from 'typeorm';
import { Problem } from '../entities/problem.entity';

export class ProblemsRepository extends Repository<Problem> {}
