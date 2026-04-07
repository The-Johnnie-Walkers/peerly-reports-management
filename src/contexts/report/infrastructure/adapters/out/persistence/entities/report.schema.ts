import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ReportStatus } from '../../../../../domain/enums/report-status.enum';
import { ReportReason, ReportType } from '../../../../../domain/enums/report-reason.enum';

export type ReportDocument = HydratedDocument<ReportSchema>;

@Schema()
export class ReportSchema {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  authorId: string;

  @Prop({ required: true, enum: ReportStatus, default: ReportStatus.PENDING })
  status: ReportStatus;

  @Prop({ required: true, enum: ReportReason })
  reason: ReportReason;

  @Prop({ required: true, enum: ReportType })
  type: ReportType;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ type: String, nullable: true })
  idInvolvedUser: string | null;

  @Prop({ required: true })
  updatedAt: Date;
}

export const ReportSchemaDefinition = SchemaFactory.createForClass(ReportSchema);