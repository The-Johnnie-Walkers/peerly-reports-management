import { Inject, Injectable } from '@nestjs/common';
import type { Report } from '../../domain/entities/report.entity';
import type { ReportRepositoryOutPort } from '../../domain/ports/out/report-repository-out.port';
import type { GetAllReportsUseCasePort } from '../../domain/ports/in/report-use-case.port';

export const GET_ALL_REPORTS_USE_CASE_TOKEN = 'GetAllReportsUseCaseToken';

@Injectable()
export class GetAllReportsUseCaseImpl implements GetAllReportsUseCasePort {
  constructor(
    @Inject('ReportRepositoryOutPortToken')
    private reportRepository: ReportRepositoryOutPort,
  ) {}

  async execute(): Promise<Report[]> {
    return await this.reportRepository.findAll();
  }
}