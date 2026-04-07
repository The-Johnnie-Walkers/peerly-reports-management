import { Inject, Injectable } from '@nestjs/common';
import type { Report } from '../../domain/entities/report.entity';
import type { ReportRepositoryOutPort } from '../../domain/ports/out/report-repository-out.port';
import type { CreateReportUseCasePort } from '../../domain/ports/in/report-use-case.port';

export const CREATE_REPORT_USE_CASE_TOKEN = 'CreateReportUseCaseToken';

@Injectable()
export class CreateReportUseCaseImpl implements CreateReportUseCasePort {
  constructor(
    @Inject('ReportRepositoryOutPortToken')
    private reportRepository: ReportRepositoryOutPort,
  ) {}

  async execute(report: Report): Promise<Report> {
    if (!report.validateFields()) {
      throw new Error('Title and content are required');
    }

    if (report.validateSelfReport()) {
      throw new Error('Users cannot report themselves');
    }

    return await this.reportRepository.save(report);
  }
}