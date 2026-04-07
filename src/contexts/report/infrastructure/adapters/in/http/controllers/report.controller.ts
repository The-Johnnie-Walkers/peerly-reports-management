import { Controller, Post, Put, Get, Param, Body, HttpCode, HttpStatus, Headers, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { ReportService } from 'src/contexts/report/application/services/report.service';
import { ReportDtoMapper } from '../mapper/report-dto.mapper';
import { CreateReportRequestDto } from '../dto/request/create-report-request.dto';
import { UpdateReportStatusRequestDto } from '../dto/request/update-report-status-request.dto';
import { ReportResponseDto } from '../dto/response/report-response.dto';
import { UserClientService } from '../../../out/rabbitmq/user-client.service';
import { JwtHelperService } from '../../../out/jwt/jwt-helper.service';

@Controller('reports')
export class ReportController {
  constructor(
    private reportService: ReportService,
    private reportDtoMapper: ReportDtoMapper,
    private userClientService: UserClientService,
    private jwtHelperService: JwtHelperService,
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

  private async getUserIdFromAuth(authHeader: string): Promise<string> {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }
    return this.jwtHelperService.extractUserIdFromToken(authHeader);
  }

  @Put(':id/status')
  async updateReportStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateReportStatusRequestDto,
    @Headers('authorization') authHeader: string,
  ): Promise<ReportResponseDto> {
    const userId = await this.getUserIdFromAuth(authHeader);
    const isAdmin = await this.userClientService.isAdmin(userId);
    if (!isAdmin) {
      throw new ForbiddenException('Only admins can update report status');
    }
    const updatedReport = await this.reportService.updateReportStatus(id, updateStatusDto.status);
    return this.reportDtoMapper.toResponse(updatedReport);
  }

  @Put(':id/resolve')
  async resolveReport(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<ReportResponseDto> {
    const userId = await this.getUserIdFromAuth(authHeader);
    const isAdmin = await this.userClientService.isAdmin(userId);
    if (!isAdmin) {
      throw new ForbiddenException('Only admins can resolve reports');
    }
    const resolvedReport = await this.reportService.resolveReport(id);
    return this.reportDtoMapper.toResponse(resolvedReport);
  }

  @Put(':id/reject')
  async rejectReport(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<ReportResponseDto> {
    const userId = await this.getUserIdFromAuth(authHeader);
    const isAdmin = await this.userClientService.isAdmin(userId);
    if (!isAdmin) {
      throw new ForbiddenException('Only admins can reject reports');
    }
    const rejectedReport = await this.reportService.rejectReport(id);
    return this.reportDtoMapper.toResponse(rejectedReport);
  }

  @Put(':id/in-progress')
  async markInProgress(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<ReportResponseDto> {
    const userId = await this.getUserIdFromAuth(authHeader);
    const isAdmin = await this.userClientService.isAdmin(userId);
    if (!isAdmin) {
      throw new ForbiddenException('Only admins can mark reports as in progress');
    }
    const report = await this.reportService.markInProgress(id);
    return this.reportDtoMapper.toResponse(report);
  }
}