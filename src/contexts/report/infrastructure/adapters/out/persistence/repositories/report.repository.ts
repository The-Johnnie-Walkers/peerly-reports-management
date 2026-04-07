import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Report } from '../../../../../domain/entities/report.entity';
import { ReportDocument } from '../entities/report.schema';
import { ReportMapper } from '../entities/report.mapper';
import { Model } from 'mongoose';

@Injectable()
export class ReportRepository {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
    private reportMapper: ReportMapper,
  ) {}

  async findAll(): Promise<Report[]> {
    const documents = await this.reportModel.find().exec();
    return documents.map((doc) => this.reportMapper.toDomain(doc));
  }

  async findById(id: string): Promise<Report | null> {
    const document = await this.reportModel.findById(id).exec();
    return document ? this.reportMapper.toDomain(document) : null;
  }

  async save(report: Report): Promise<Report> {
    const saved = await this.reportModel.create(this.reportMapper.toDocument(report));
    return this.reportMapper.toDomain(saved);
  }

  async update(id: string, report: Report): Promise<Report> {
    const document = await this.reportModel
      .findByIdAndUpdate(id, this.reportMapper.toDocument(report), { new: true })
      .exec();
    if (!document) throw new Error('Report not found');
    return this.reportMapper.toDomain(document);
  }

  async findByAuthorId(authorId: string): Promise<Report[]> {
    const documents = await this.reportModel.find({ authorId }).exec();
    return documents.map((doc) => this.reportMapper.toDomain(doc));
  }

  async findByInvolvedUserId(userId: string): Promise<Report[]> {
    const documents = await this.reportModel.find({ idInvolvedUser: userId }).exec();
    return documents.map((doc) => this.reportMapper.toDomain(doc));
  }

  async findByStatus(status: string): Promise<Report[]> {
    const documents = await this.reportModel.find({ status }).exec();
    return documents.map((doc) => this.reportMapper.toDomain(doc));
  }
}