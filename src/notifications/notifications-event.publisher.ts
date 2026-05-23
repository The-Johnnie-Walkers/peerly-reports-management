import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationsEventPublisher {
  private readonly logger = new Logger(NotificationsEventPublisher.name);

  constructor(
    @Inject('NOTIFICATIONS_SERVICE') private readonly client: ClientProxy,
  ) {}

  emit(pattern: string, data: object): void {
    this.client.emit(pattern, data).subscribe({
      error: (err) => this.logger.error(`Failed to emit ${pattern}: ${err.message}`),
    });
  }
}
