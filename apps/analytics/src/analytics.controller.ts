import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AnalyticsService } from './analytics.service';
import { EnrichedEventDto } from '@app/common';

@Controller()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @EventPattern('event_created')
  async processEvent(data: EnrichedEventDto) {
    return this.analyticsService.processEvent(data);
  }
}
