import { Injectable } from '@nestjs/common';
import { Report } from '../../../../domain/entities/report.entity';
import { ReportRepository } from './repositories/report.repository';
import { ReportRepositoryOutPort } from '../../../../domain/ports/out/report-repository-out.port';

@Injectable()
export class ReportRepositoryAdapter implements ReportRepositoryOutPort {
  constructor(private reportRepository: ReportRepository) {}

  async save(report: Report): Promise<Report> {
    return await this.reportRepository.save(report);
  }

  async update(id: string, report: Report): Promise<Report> {
    return await this.reportRepository.update(id, report);
  }

  async findById(id: string): Promise<Report | null> {
    return await this.reportRepository.findById(id);
  }

  async findAll(): Promise<Report[]> {
    return await this.reportRepository.findAll();
  }

  async findByAuthorId(authorId: string): Promise<Report[]> {
    return await this.reportRepository.findByAuthorId(authorId);
  }

  async findByInvolvedUserId(userId: string): Promise<Report[]> {
    return await this.reportRepository.findByInvolvedUserId(userId);
  }

  async findByStatus(status: string): Promise<Report[]> {
    return await this.reportRepository.findByStatus(status);
  }
}