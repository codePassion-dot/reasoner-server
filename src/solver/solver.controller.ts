import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SolverService } from './solver.service';
import { SolverResult } from './solver.types';
import {
  solveBadRequestResponse,
  solveDescription,
  solveSuccessfulResponse,
} from './swagger/solve';

@Controller('solver')
export class SolverController {
  constructor(private readonly solverService: SolverService) {}

  @ApiOperation(solveDescription)
  @ApiResponse(solveSuccessfulResponse)
  @ApiResponse(solveBadRequestResponse)
  @Get('solve')
  async solve(): Promise<SolverResult> {
    return this.solverService.solve();
  }
}
