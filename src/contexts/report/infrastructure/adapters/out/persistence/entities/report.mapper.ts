import { Report } from '../../../../../domain/entities/report.entity';
import { ReportDocument, ReportSchema } from './report.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportMapper {
  toDomain(document: ReportDocument): Report {
    return new Report({
      id: document._id.toString(),
      title: document.title,
      content: document.content,
      authorId: document.authorId,
      status: document.status,
      reason: document.reason,
      type: document.type,
      createdAt: document.createdAt,
      idInvolvedUser: document.idInvolvedUser,
      involvedUserName: document.involvedUserName,
      involvedUserUsername: document.involvedUserUsername,
      involvedUserProfilePic: document.involvedUserProfilePic,
      updatedAt: document.updatedAt,
    });
  }

  toDocument(entity: Report): Partial<ReportSchema> {
    return {
      title: entity.title,
      content: entity.content,
      authorId: entity.authorId,
      status: entity.status,
      reason: entity.reason,
      type: entity.type,
      createdAt: entity.createdAt,
      idInvolvedUser: entity.idInvolvedUser,
      involvedUserName: entity.involvedUserName,
      involvedUserUsername: entity.involvedUserUsername,
      involvedUserProfilePic: entity.involvedUserProfilePic,
      updatedAt: entity.updatedAt,
    };
  }
}