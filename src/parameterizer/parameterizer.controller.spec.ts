import { Test, TestingModule } from '@nestjs/testing';
import { ParameterizerController } from './parameterizer.controller';

describe('ParameterizerController', () => {
  let controller: ParameterizerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParameterizerController],
    }).compile();

    controller = module.get<ParameterizerController>(ParameterizerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
