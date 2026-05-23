import { IsEnum, IsUUID, IsNotEmpty } from 'class-validator';
import { ReportStatus } from 'src/contexts/report/domain/enums/report-status.enum';

export class UpdateReportStatusRequestDto {
  @IsEnum(ReportStatus)
  @IsNotEmpty()
  status: ReportStatus;
}

export class GetReportsByUserRequestDto {
  @IsUUID()
  userId: string;
}