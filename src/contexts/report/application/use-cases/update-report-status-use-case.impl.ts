import { Inject, Injectable } from '@nestjs/common';
import type { Report } from '../../domain/entities/report.entity';
import type { ReportStatus } from '../../domain/enums/report-status.enum';
import type { ReportRepositoryOutPort } from '../../domain/ports/out/report-repository-out.port';
import type { UpdateReportStatusUseCasePort } from '../../domain/ports/in/report-use-case.port';

export const UPDATE_REPORT_STATUS_USE_CASE_TOKEN = 'UpdateReportStatusUseCaseToken';

@Injectable()
export class UpdateReportStatusUseCaseImpl implements UpdateReportStatusUseCasePort {
  constructor(
    @Inject('ReportRepositoryOutPortToken')
    private reportRepository: ReportRepositoryOutPort,
  ) {}

  async execute(id: string, status: ReportStatus): Promise<Report> {
    const report = await this.reportRepository.findById(id);
    if (!report) {
      throw new Error(`Report with id ${id} not found`);
    }

    report.status = status;
    report.updatedAt = new Date();

    return await this.reportRepository.update(id, report);
  }
}