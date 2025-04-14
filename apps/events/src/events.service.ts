import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EnrichedEventDto } from '@app/common';

@Injectable()
export class EventsService {
  constructor(
    @Inject('ANALYTICS_SERVICE') private readonly analyticsClient: ClientProxy,
  ) {}

  async intakeEvent(event: EnrichedEventDto) {
    // Publica o evento para o serviço de analytics
    this.analyticsClient.emit('event_created', event);

    // Retorna uma resposta imediata para o cliente
    return {
      success: true,
      message: 'Event received successfully',
      timestamp: new Date(),
    };
  }
}
