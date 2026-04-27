import { Inject, Injectable } from '@nestjs/common';
import type { Report } from '../../domain/entities/report.entity';
import type { ReportRepositoryOutPort } from '../../domain/ports/out/report-repository-out.port';
import type { CreateReportUseCasePort } from '../../domain/ports/in/report-use-case.port';
import { UserClientService } from '../../infrastructure/adapters/out/rabbitmq/user-client.service';
import { ReportType } from '../../domain/enums/report-reason.enum';

export const CREATE_REPORT_USE_CASE_TOKEN = 'CreateReportUseCaseToken';

@Injectable()
export class CreateReportUseCaseImpl implements CreateReportUseCasePort {
  constructor(
    @Inject('ReportRepositoryOutPortToken')
    private reportRepository: ReportRepositoryOutPort,
    private userClientService: UserClientService,
  ) {}

  async execute(report: Report): Promise<Report> {
    if (!report.validateFields()) {
      throw new Error('Title and content are required');
    }

    if (report.validateSelfReport()) {
      throw new Error('Users cannot report themselves');
    }

    if (report.type === ReportType.USER && report.idInvolvedUser) {
      const userData = await this.userClientService.getUserById(report.idInvolvedUser);
      if (userData) {
        report.involvedUserName = `${userData.name} ${userData.lastname}`;
        report.involvedUserUsername = userData.username;
        report.involvedUserProfilePic = userData.profilePicURL;
      }
    }

    return await this.reportRepository.save(report);
  }
}