import { Report } from '../../entities/report.entity';
import { ReportStatus } from '../../enums/report-status.enum';

export interface ReportRepositoryOutPort {
  save(report: Report): Promise<Report>;

  update(id: string, report: Report): Promise<Report>;

  findById(id: string): Promise<Report | null>;

  findAll(): Promise<Report[]>;

  findByAuthorId(authorId: string): Promise<Report[]>;

  findByInvolvedUserId(userId: string): Promise<Report[]>;

  findByStatus(status: ReportStatus): Promise<Report[]>;
}