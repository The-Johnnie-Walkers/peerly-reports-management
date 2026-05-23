import { CreateReportUseCaseImpl } from './create-report-use-case.impl';
import { GetReportUseCaseImpl } from './get-report-use-case.impl';
import { GetAllReportsUseCaseImpl } from './get-all-reports-use-case.impl';
import { UpdateReportStatusUseCaseImpl } from './update-report-status-use-case.impl';

const makeReport = (overrides: any = {}) => ({
  id: 'r1',
  title: 'Test Report',
  content: 'Some content',
  authorId: 'u1',
  idInvolvedUser: 'u2',
  involvedUserName: null,
  involvedUserUsername: null,
  involvedUserProfilePic: null,
  status: 'PENDING',
  type: 'USER',
  validateFields: jest.fn().mockReturnValue(true),
  validateSelfReport: jest.fn().mockReturnValue(false),
  ...overrides,
});

describe('Report Use Cases', () => {
  let mockRepo: any;
  let mockPublisher: any;
  let mockUserClient: any;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn().mockImplementation(async (r) => r),
      findById: jest.fn().mockResolvedValue(makeReport()),
      findAll: jest.fn().mockResolvedValue([makeReport()]),
      update: jest.fn().mockImplementation(async (_, r) => r),
    };
    mockPublisher = { emit: jest.fn() };
    mockUserClient = {
      getUserById: jest.fn().mockResolvedValue({
        name: 'John', lastname: 'Doe', username: 'johndoe', profilePicURL: null,
      }),
    };
  });

  describe('CreateReportUseCaseImpl', () => {
    it('should create report and emit notification', async () => {
      const report = makeReport();
      const useCase = new CreateReportUseCaseImpl(mockRepo, mockUserClient, mockPublisher);
      const result = await useCase.execute(report);
      expect(mockRepo.save).toHaveBeenCalled();
      expect(mockPublisher.emit).toHaveBeenCalledWith(
        'notification.report.created',
        expect.objectContaining({ authorId: 'u1' }),
      );
    });

    it('should throw if validateFields returns false', async () => {
      const report = makeReport({ validateFields: jest.fn().mockReturnValue(false) });
      const useCase = new CreateReportUseCaseImpl(mockRepo, mockUserClient, mockPublisher);
      await expect(useCase.execute(report)).rejects.toThrow('Title and content are required');
    });

    it('should throw if user reports themselves', async () => {
      const report = makeReport({ validateSelfReport: jest.fn().mockReturnValue(true) });
      const useCase = new CreateReportUseCaseImpl(mockRepo, mockUserClient, mockPublisher);
      await expect(useCase.execute(report)).rejects.toThrow('Users cannot report themselves');
    });

    it('should enrich report with user data when type is USER', async () => {
      const report = makeReport();
      const useCase = new CreateReportUseCaseImpl(mockRepo, mockUserClient, mockPublisher);
      await useCase.execute(report);
      expect(mockUserClient.getUserById).toHaveBeenCalledWith('u2');
      expect(report.involvedUserName).toBe('John Doe');
    });

    it('should handle null user data gracefully', async () => {
      mockUserClient.getUserById.mockResolvedValue(null);
      const report = makeReport();
      const useCase = new CreateReportUseCaseImpl(mockRepo, mockUserClient, mockPublisher);
      await expect(useCase.execute(report)).resolves.toBeDefined();
    });
  });

  describe('GetReportUseCaseImpl', () => {
    it('should return report by id', async () => {
      const useCase = new GetReportUseCaseImpl(mockRepo);
      const result = await useCase.execute('r1');
      expect(result.id).toBe('r1');
    });

    it('should throw if report not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      const useCase = new GetReportUseCaseImpl(mockRepo);
      await expect(useCase.execute('bad')).rejects.toThrow('Report with id bad not found');
    });
  });

  describe('GetAllReportsUseCaseImpl', () => {
    it('should return all reports', async () => {
      const useCase = new GetAllReportsUseCaseImpl(mockRepo);
      const result = await useCase.execute();
      expect(result).toHaveLength(1);
    });

    it('should return empty array when none', async () => {
      mockRepo.findAll.mockResolvedValue([]);
      const useCase = new GetAllReportsUseCaseImpl(mockRepo);
      const result = await useCase.execute();
      expect(result).toEqual([]);
    });
  });

  describe('UpdateReportStatusUseCaseImpl', () => {
    it('should update status and emit notification', async () => {
      const useCase = new UpdateReportStatusUseCaseImpl(mockRepo, mockPublisher);
      const result = await useCase.execute('r1', 'RESOLVED' as any);
      expect(result.status).toBe('RESOLVED');
      expect(mockPublisher.emit).toHaveBeenCalledWith(
        'notification.report.status.updated',
        expect.objectContaining({ reportId: 'r1', newStatus: 'RESOLVED' }),
      );
    });

    it('should throw if report not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      const useCase = new UpdateReportStatusUseCaseImpl(mockRepo, mockPublisher);
      await expect(useCase.execute('bad', 'RESOLVED' as any)).rejects.toThrow('Report with id bad not found');
    });
  });
});
