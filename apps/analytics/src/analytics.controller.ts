import { Controller, Get, Query } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AnalyticsService } from './analytics.service';
import { EnrichedEventDto } from '@app/common';
import { GetMetricsDto } from 'apps/analytics/src/dto/get-metrics.dto';

@Controller()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('metrics')
  async getMetrics(@Query() query: GetMetricsDto) {
    return this.analyticsService.getMetrics(
      query.siteId,
      new Date(query.startDate),
      new Date(query.endDate),
      query.dimensions,
    );
  }

  @EventPattern('event_created')
  async processEvent(data: EnrichedEventDto) {
    return this.analyticsService.processEvent(data);
  }
}
