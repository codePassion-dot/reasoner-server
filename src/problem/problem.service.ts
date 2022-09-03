import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'src/users/connection.entity';
import { User } from 'src/users/user.entity';
import { Problem } from './problem.entity';
import { ProblemsRepository } from './problems.repository';

@Injectable()
export class ProblemService {
  constructor(
    @InjectRepository(Problem) private problemsRepository: ProblemsRepository,
  ) {}

  async createProblem(
    connection: Partial<Connection>,
    user: User,
  ): Promise<Problem> {
    const problem = this.problemsRepository.create({ connection, user });
    await this.problemsRepository.save(problem);
    return problem;
  }
}
