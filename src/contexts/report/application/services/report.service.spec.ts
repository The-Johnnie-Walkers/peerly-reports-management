import { ReportService } from './report.service';
import { ReportStatus } from '../../domain/enums/report-status.enum';

const mockReport = { id: 'r1', title: 'Test', status: ReportStatus.PENDING } as any;

describe('ReportService', () => {
  let service: ReportService;
  let mCreate: any, mGet: any, mGetAll: any, mUpdate: any;

  beforeEach(() => {
    mCreate = { execute: jest.fn().mockResolvedValue(mockReport) };
    mGet    = { execute: jest.fn().mockResolvedValue(mockReport) };
    mGetAll = { execute: jest.fn().mockResolvedValue([mockReport]) };
    mUpdate = { execute: jest.fn().mockResolvedValue({ ...mockReport, status: ReportStatus.RESOLVED }) };
    service = new ReportService(mCreate, mGet, mGetAll, mUpdate);
  });

  it('should create report', async () => {
    const result = await service.createReport(mockReport);
    expect(result).toBe(mockReport);
    expect(mCreate.execute).toHaveBeenCalledWith(mockReport);
  });

  it('should get report by id', async () => {
    const result = await service.getReport('r1');
    expect(result).toBe(mockReport);
  });

  it('should get all reports', async () => {
    const result = await service.getAllReports();
    expect(result).toHaveLength(1);
  });

  it('should update report status', async () => {
    const result = await service.updateReportStatus('r1', ReportStatus.RESOLVED);
    expect(result.status).toBe(ReportStatus.RESOLVED);
  });

  it('should resolve report', async () => {
    await service.resolveReport('r1');
    expect(mUpdate.execute).toHaveBeenCalledWith('r1', ReportStatus.RESOLVED);
  });

  it('should reject report', async () => {
    await service.rejectReport('r1');
    expect(mUpdate.execute).toHaveBeenCalledWith('r1', ReportStatus.REJECTED);
  });

  it('should mark report in progress', async () => {
    await service.markInProgress('r1');
    expect(mUpdate.execute).toHaveBeenCalledWith('r1', ReportStatus.IN_PROGRESS);
  });
});
