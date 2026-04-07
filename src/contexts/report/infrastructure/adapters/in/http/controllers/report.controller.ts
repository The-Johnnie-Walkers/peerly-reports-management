import { Controller, Post, Put, Get, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ReportService } from 'src/contexts/report/application/services/report.service';
import { ReportDtoMapper } from '../mapper/report-dto.mapper';
import { CreateReportRequestDto } from '../dto/request/create-report-request.dto';
import { UpdateReportStatusRequestDto } from '../dto/request/update-report-status-request.dto';
import { ReportResponseDto } from '../dto/response/report-response.dto';

@Controller('reports')
export class ReportController {
  constructor(
    private reportService: ReportService,
    private reportDtoMapper: ReportDtoMapper,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReport(@Body() createReportDto: CreateReportRequestDto): Promise<ReportResponseDto> {
    const report = this.reportDtoMapper.toDomain(createReportDto);
    const createdReport = await this.reportService.createReport(report);
    return this.reportDtoMapper.toResponse(createdReport);
  }

  @Get(':id')
  async getReport(@Param('id') id: string): Promise<ReportResponseDto> {
    const report = await this.reportService.getReport(id);
    return this.reportDtoMapper.toResponse(report);
  }

  @Get()
  async getAllReports(): Promise<ReportResponseDto[]> {
    const reports = await this.reportService.getAllReports();
    return this.reportDtoMapper.toResponseList(reports);
  }

  @Put(':id/status')
  async updateReportStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateReportStatusRequestDto,
  ): Promise<ReportResponseDto> {
    const updatedReport = await this.reportService.updateReportStatus(id, updateStatusDto.status);
    return this.reportDtoMapper.toResponse(updatedReport);
  }

  @Put(':id/resolve')
  async resolveReport(@Param('id') id: string): Promise<ReportResponseDto> {
    const resolvedReport = await this.reportService.resolveReport(id);
    return this.reportDtoMapper.toResponse(resolvedReport);
  }

  @Put(':id/reject')
  async rejectReport(@Param('id') id: string): Promise<ReportResponseDto> {
    const rejectedReport = await this.reportService.rejectReport(id);
    return this.reportDtoMapper.toResponse(rejectedReport);
  }

  @Put(':id/in-progress')
  async markInProgress(@Param('id') id: string): Promise<ReportResponseDto> {
    const report = await this.reportService.markInProgress(id);
    return this.reportDtoMapper.toResponse(report);
  }
}