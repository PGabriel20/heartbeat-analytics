import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EnrichedEventDto } from '@app/common';

@Injectable()
export class EventsService {
  constructor(
    @Inject('ANALYTICS_SERVICE') private readonly analyticsClient: ClientProxy,
  ) {}

  async intakeEvent(event: EnrichedEventDto) {
    this.analyticsClient.emit('event_created', event);

    return {
      success: true,
      message: 'Event received successfully',
      timestamp: new Date(),
    };
  }
}
