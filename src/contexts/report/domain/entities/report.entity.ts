import { ReportStatus } from '../../domain/enums/report-status.enum';
import { ReportReason } from '../../domain/enums/report-reason.enum';
import { ReportType } from '../../domain/enums/report-reason.enum';

export interface ReportProps {
  id: string;
  title: string;
  content: string;
  authorId: string;
  status: ReportStatus;
  reason: ReportReason;
  type: ReportType;
  createdAt: Date;
  idInvolvedUser: string | null;
  involvedUserName: string | null;
  involvedUserUsername: string | null;
  involvedUserProfilePic: string | null;
  updatedAt: Date;
}

export class Report {
  constructor(private props: ReportProps) {}

  get id(): string {
    return this.props.id;
  }
  set id(id: string) {
    this.props.id = id;
  }
  get title(): string {
    return this.props.title;
  }
  set title(title: string) {
    this.props.title = title;
  }
  get content(): string {
    return this.props.content;
  }
  set content(content: string) {
    this.props.content = content;
  }
  get authorId(): string {
    return this.props.authorId;
  }
  set authorId(authorId: string) {
    this.props.authorId = authorId;
  }
  get status(): ReportStatus {
    return this.props.status;
  }
  set status(status: ReportStatus) {
    this.props.status = status;
  }
  get reason(): ReportReason {
    return this.props.reason;
  }
  set reason(reason: ReportReason) {
    this.props.reason = reason;
  }
  get type(): ReportType {
    return this.props.type;
  }
  set type(type: ReportType) {
    this.props.type = type;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }
  get idInvolvedUser(): string | null {
    return this.props.idInvolvedUser;
  }
  set idInvolvedUser(idInvolvedUser: string | null) {
    this.props.idInvolvedUser = idInvolvedUser;
  }
  get involvedUserName(): string | null {
    return this.props.involvedUserName;
  }
  set involvedUserName(involvedUserName: string | null) {
    this.props.involvedUserName = involvedUserName;
  }
  get involvedUserUsername(): string | null {
    return this.props.involvedUserUsername;
  }
  set involvedUserUsername(involvedUserUsername: string | null) {
    this.props.involvedUserUsername = involvedUserUsername;
  }
  get involvedUserProfilePic(): string | null {
    return this.props.involvedUserProfilePic;
  }
  set involvedUserProfilePic(involvedUserProfilePic: string | null) {
    this.props.involvedUserProfilePic = involvedUserProfilePic;
  }

  validateSelfReport(): boolean {
    return this.props.authorId === this.props.idInvolvedUser;
  }

  validateFields(): boolean {
    return this.props.title.trim() !== '' && this.props.content.trim() !== '';
  }

  resolve(): void {
    if (this.validateSelfReport()) {
      throw new Error('Users cannot resolve their own reports.');
    }
    this.props.status = ReportStatus.RESOLVED;
    this.props.updatedAt = new Date();
  }

  reject(): void {
    this.props.status = ReportStatus.REJECTED;
    this.props.updatedAt = new Date();
  }

  reopen(): void {
    this.props.status = ReportStatus.IN_PROGRESS;
    this.props.updatedAt = new Date();
  }

  markInProgress(): void {
    this.props.status = ReportStatus.IN_PROGRESS;
    this.props.updatedAt = new Date();
  }
}