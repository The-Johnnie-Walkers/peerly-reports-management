import { Inject, Injectable } from '@nestjs/common';
import type { Report } from '../../domain/entities/report.entity';
import type { ReportRepositoryOutPort } from '../../domain/ports/out/report-repository-out.port';
import type { GetReportUseCasePort } from '../../domain/ports/in/report-use-case.port';

export const GET_REPORT_USE_CASE_TOKEN = 'GetReportUseCaseToken';

@Injectable()
export class GetReportUseCaseImpl implements GetReportUseCasePort {
  constructor(
    @Inject('ReportRepositoryOutPortToken')
    private reportRepository: ReportRepositoryOutPort,
  ) {}

  async execute(id: string): Promise<Report> {
    const report = await this.reportRepository.findById(id);
    if (!report) {
      throw new Error(`Report with id ${id} not found`);
    }
    return report;
  }
}