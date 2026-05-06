import { Inject, Injectable } from '@nestjs/common';
import type { Report } from '../../domain/entities/report.entity';
import type { ReportStatus } from '../../domain/enums/report-status.enum';
import type { ReportRepositoryOutPort } from '../../domain/ports/out/report-repository-out.port';
import type { UpdateReportStatusUseCasePort } from '../../domain/ports/in/report-use-case.port';
import { NotificationsEventPublisher } from '../../../../../notifications/notifications-event.publisher';

export const UPDATE_REPORT_STATUS_USE_CASE_TOKEN = 'UpdateReportStatusUseCaseToken';

@Injectable()
export class UpdateReportStatusUseCaseImpl implements UpdateReportStatusUseCasePort {
  constructor(
    @Inject('ReportRepositoryOutPortToken')
    private reportRepository: ReportRepositoryOutPort,
    private readonly notificationsPublisher: NotificationsEventPublisher,
  ) {}

  async execute(id: string, status: ReportStatus): Promise<Report> {
    const report = await this.reportRepository.findById(id);
    if (!report) {
      throw new Error(`Report with id ${id} not found`);
    }

    report.status = status;
    report.updatedAt = new Date();

    const updated = await this.reportRepository.update(id, report);

    this.notificationsPublisher.emit('notification.report.status.updated', {
      reportId: id,
      newStatus: status,
      authorId: report.authorId,
    });

    return updated;
  }
}
