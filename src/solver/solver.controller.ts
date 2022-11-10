import { Controller, Get } from '@nestjs/common';
import { SolverService } from './solver.service';

@Controller('solver')
export class SolverController {
  constructor(private readonly solverService: SolverService) {}
  @Get('solve')
  async solve(): Promise<Record<string, string | number>> {
    return this.solverService.solve();
  }
}
