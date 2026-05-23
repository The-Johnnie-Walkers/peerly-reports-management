export class ReportResponseDto {
  id: string;
  title: string;
  content: string;
  authorId: string;
  status: string;
  reason: string;
  type: string;
  createdAt: Date;
  idInvolvedUser: string | null;
  involvedUserName: string | null;
  involvedUserUsername: string | null;
  involvedUserProfilePic: string | null;
  updatedAt: Date;
}

export class ReportListResponseDto {
  reports: ReportResponseDto[];
  total: number;
}