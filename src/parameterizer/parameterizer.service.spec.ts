import { Test, TestingModule } from '@nestjs/testing';
import { ParameterizerService } from './parameterizer.service';

describe('ParameterizerService', () => {
  let service: ParameterizerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParameterizerService],
    }).compile();

    service = module.get<ParameterizerService>(ParameterizerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
