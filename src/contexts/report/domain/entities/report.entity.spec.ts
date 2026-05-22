import { Report } from './report.entity';
import { ReportStatus } from '../enums/report-status.enum';
import { ReportReason, ReportType } from '../enums/report-reason.enum';

const makeReport = (overrides: any = {}) =>
  new Report({
    id: 'r1',
    title: 'Test Report',
    content: 'Some content',
    authorId: 'u1',
    idInvolvedUser: 'u2',
    involvedUserName: null,
    involvedUserUsername: null,
    involvedUserProfilePic: null,
    status: ReportStatus.PENDING,
    reason: ReportReason.HARASSMENT,
    type: ReportType.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

describe('Report Entity', () => {
  it('should validate fields correctly when title and content are present', () => {
    const report = makeReport();
    expect(report.validateFields()).toBe(true);
  });

  it('should fail validation when title is empty', () => {
    const report = makeReport({ title: '  ' });
    expect(report.validateFields()).toBe(false);
  });

  it('should fail validation when content is empty', () => {
    const report = makeReport({ content: '' });
    expect(report.validateFields()).toBe(false);
  });

  it('should detect self-report', () => {
    const report = makeReport({ authorId: 'u1', idInvolvedUser: 'u1' });
    expect(report.validateSelfReport()).toBe(true);
  });

  it('should not detect self-report when different users', () => {
    const report = makeReport();
    expect(report.validateSelfReport()).toBe(false);
  });

  it('should resolve report', () => {
    const report = makeReport();
    report.resolve();
    expect(report.status).toBe(ReportStatus.RESOLVED);
  });

  it('should throw when resolving own report', () => {
    const report = makeReport({ authorId: 'u1', idInvolvedUser: 'u1' });
    expect(() => report.resolve()).toThrow('Users cannot resolve their own reports.');
  });

  it('should reject report', () => {
    const report = makeReport();
    report.reject();
    expect(report.status).toBe(ReportStatus.REJECTED);
  });

  it('should reopen report', () => {
    const report = makeReport({ status: ReportStatus.RESOLVED });
    report.reopen();
    expect(report.status).toBe(ReportStatus.IN_PROGRESS);
  });

  it('should mark report in progress', () => {
    const report = makeReport();
    report.markInProgress();
    expect(report.status).toBe(ReportStatus.IN_PROGRESS);
  });

  it('should expose all getters correctly', () => {
    const report = makeReport();
    expect(report.id).toBe('r1');
    expect(report.title).toBe('Test Report');
    expect(report.content).toBe('Some content');
    expect(report.authorId).toBe('u1');
    expect(report.type).toBe(ReportType.USER);
    expect(report.reason).toBe(ReportReason.HARASSMENT);
  });
});
