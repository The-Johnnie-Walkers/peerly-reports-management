import { Report } from '../../entities/report.entity';
import { ReportStatus } from '../../enums/report-status.enum';

export interface CreateReportUseCasePort {
  execute(report: Report): Promise<Report>;
}

export const CREATE_REPORT_USE_CASE_TOKEN = 'CreateReportUseCaseToken';

export interface GetReportUseCasePort {
  execute(id: string): Promise<Report>;
}

export const GET_REPORT_USE_CASE_TOKEN = 'GetReportUseCaseToken';

export interface GetAllReportsUseCasePort {
  execute(): Promise<Report[]>;
}

export const GET_ALL_REPORTS_USE_CASE_TOKEN = 'GetAllReportsUseCaseToken';

export interface UpdateReportStatusUseCasePort {
  execute(id: string, status: ReportStatus): Promise<Report>;
}

export const UPDATE_REPORT_STATUS_USE_CASE_TOKEN = 'UpdateReportStatusUseCaseToken';

export interface GetReportsByAuthorUseCasePort {
  execute(authorId: string): Promise<Report[]>;
}

export const GET_REPORTS_BY_AUTHOR_USE_CASE_TOKEN = 'GetReportsByAuthorUseCaseToken';

export interface GetReportsByInvolvedUserUseCasePort {
  execute(userId: string): Promise<Report[]>;
}

export const GET_REPORTS_BY_INVOLVED_USER_USE_CASE_TOKEN = 'GetReportsByInvolvedUserUseCaseToken';

export interface GetReportsByStatusUseCasePort {
  execute(status: ReportStatus): Promise<Report[]>;
}

export const GET_REPORTS_BY_STATUS_USE_CASE_TOKEN = 'GetReportsByStatusUseCaseToken';