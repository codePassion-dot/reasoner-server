import { Test, TestingModule } from '@nestjs/testing';
import { SolverController } from './solver.controller';

describe('SolverController', () => {
  let controller: SolverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolverController],
    }).compile();

    controller = module.get<SolverController>(SolverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
