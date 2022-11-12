import { Controller, Get } from '@nestjs/common';
import { SolverService } from './solver.service';
import { SolverResult } from './solver.types';

@Controller('solver')
export class SolverController {
  constructor(private readonly solverService: SolverService) {}
  @Get('solve')
  async solve(): Promise<SolverResult> {
    return this.solverService.solve();
  }
}
