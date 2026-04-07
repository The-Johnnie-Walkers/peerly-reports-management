import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportSchemaDefinition } from './infrastructure/adapters/out/persistence/entities/report.schema';
import { Report } from './domain/entities/report.entity';
import { ReportMapper } from './infrastructure/adapters/out/persistence/entities/report.mapper';
import { ReportRepository } from './infrastructure/adapters/out/persistence/repositories/report.repository';
import { ReportRepositoryAdapter } from './infrastructure/adapters/out/persistence/report-repository.adapter';
import { ReportController } from './infrastructure/adapters/in/http/controllers/report.controller';
import { ReportService } from './application/services/report.service';
import { ReportDtoMapper } from './infrastructure/adapters/in/http/mapper/report-dto.mapper';
import { CreateReportUseCaseImpl } from './application/use-cases/create-report-use-case.impl';
import { GetReportUseCaseImpl } from './application/use-cases/get-report-use-case.impl';
import { GetAllReportsUseCaseImpl } from './application/use-cases/get-all-reports-use-case.impl';
import { UpdateReportStatusUseCaseImpl } from './application/use-cases/update-report-status-use-case.impl';
import { UserClientService } from './infrastructure/adapters/out/rabbitmq/user-client.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Report.name, schema: ReportSchemaDefinition },
    ]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'user_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [
    ReportMapper,
    ReportRepository,
    ReportService,
    ReportDtoMapper,
    UserClientService,
    {
      provide: 'ReportRepositoryOutPortToken',
      useClass: ReportRepositoryAdapter,
    },
    {
      provide: 'CreateReportUseCaseToken',
      useClass: CreateReportUseCaseImpl,
    },
    {
      provide: 'GetReportUseCaseToken',
      useClass: GetReportUseCaseImpl,
    },
    {
      provide: 'GetAllReportsUseCaseToken',
      useClass: GetAllReportsUseCaseImpl,
    },
    {
      provide: 'UpdateReportStatusUseCaseToken',
      useClass: UpdateReportStatusUseCaseImpl,
    },
  ],
  controllers: [ReportController],
})
export class ReportModule {}