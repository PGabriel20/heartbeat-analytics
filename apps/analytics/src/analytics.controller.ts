import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AnalyticsService } from './analytics.service';

@Controller()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @EventPattern('event_created')
  async processEvent(data: any) {
    /**
     * @todo - Share DTO for event
     */
    return this.analyticsService.processEvent(data);
  }
}
