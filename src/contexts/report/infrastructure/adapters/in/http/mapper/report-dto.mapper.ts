import { Injectable } from '@nestjs/common';
import { Report } from 'src/contexts/report/domain/entities/report.entity';
import { CreateReportRequestDto } from '../dto/request/create-report-request.dto';
import { ReportResponseDto } from '../dto/response/report-response.dto';
import { ReportStatus } from 'src/contexts/report/domain/enums/report-status.enum';

@Injectable()
export class ReportDtoMapper {
  toDomain(dto: CreateReportRequestDto): Report {
    return new Report({
      id: '',
      title: dto.title,
      content: dto.content,
      authorId: dto.authorId,
      reason: dto.reason,
      type: dto.type,
      idInvolvedUser: dto.idInvolvedUser || null,
      status: ReportStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  toResponse(report: Report): ReportResponseDto {
    return {
      id: report.id,
      title: report.title,
      content: report.content,
      authorId: report.authorId,
      status: report.status,
      reason: report.reason,
      type: report.type,
      createdAt: report.createdAt,
      idInvolvedUser: report.idInvolvedUser,
      updatedAt: report.updatedAt,
    };
  }

  toResponseList(reports: Report[]): ReportResponseDto[] {
    return reports.map((report) => this.toResponse(report));
  }
}