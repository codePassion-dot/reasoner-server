import { Test, TestingModule } from '@nestjs/testing';
import { SolverService } from './solver.service';

describe('SolverService', () => {
  let service: SolverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SolverService],
    }).compile();

    service = module.get<SolverService>(SolverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
