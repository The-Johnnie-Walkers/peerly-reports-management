import { Inject, Injectable } from '@nestjs/common';
import { Report } from '../../domain/entities/report.entity';
import { ReportStatus } from '../../domain/enums/report-status.enum';
import {
  CREATE_REPORT_USE_CASE_TOKEN,
  GET_REPORT_USE_CASE_TOKEN,
  GET_ALL_REPORTS_USE_CASE_TOKEN,
  UPDATE_REPORT_STATUS_USE_CASE_TOKEN,
} from '../../domain/ports/in/report-use-case.port';

@Injectable()
export class ReportService {
  constructor(
    @Inject(CREATE_REPORT_USE_CASE_TOKEN)
    private createReportUseCase: any,
    @Inject(GET_REPORT_USE_CASE_TOKEN)
    private getReportUseCase: any,
    @Inject(GET_ALL_REPORTS_USE_CASE_TOKEN)
    private getAllReportsUseCase: any,
    @Inject(UPDATE_REPORT_STATUS_USE_CASE_TOKEN)
    private updateReportStatusUseCase: any,
  ) {}

  async createReport(report: Report): Promise<Report> {
    return await this.createReportUseCase.execute(report);
  }

  async getReport(id: string): Promise<Report> {
    return await this.getReportUseCase.execute(id);
  }

  async getAllReports(): Promise<Report[]> {
    return await this.getAllReportsUseCase.execute();
  }

  async updateReportStatus(id: string, status: ReportStatus): Promise<Report> {
    return await this.updateReportStatusUseCase.execute(id, status);
  }

  async resolveReport(id: string): Promise<Report> {
    return await this.updateReportStatusUseCase.execute(id, ReportStatus.RESOLVED);
  }

  async rejectReport(id: string): Promise<Report> {
    return await this.updateReportStatusUseCase.execute(id, ReportStatus.REJECTED);
  }

  async markInProgress(id: string): Promise<Report> {
    return await this.updateReportStatusUseCase.execute(id, ReportStatus.IN_PROGRESS);
  }
}