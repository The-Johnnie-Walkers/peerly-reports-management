import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ReportReason, ReportType } from 'src/contexts/report/domain/enums/report-reason.enum';

export class CreateReportRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  authorId: string;

  @IsEnum(ReportReason)
  @IsNotEmpty()
  reason: ReportReason;

  @IsEnum(ReportType)
  @IsNotEmpty()
  type: ReportType;

  @IsString()
  @IsOptional()
  idInvolvedUser?: string | null;
}