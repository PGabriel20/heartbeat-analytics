import { Controller, Post, Body, Headers, Ip } from '@nestjs/common';
import { EventsService } from './events.service';
import { BaseEventDto, EnrichedEventDto } from '@app/common';

@Controller('intake')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async intakeEvent(
    @Body() eventDto: BaseEventDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
  ) {
    // Enrich event with additional data
    const enrichedEvent: EnrichedEventDto = {
      ...eventDto,
      triggered_at: new Date(),
      timestamp: new Date(),
      ip_address: ip,
      user_agent: userAgent,
      device_info: this.parseUserAgent(userAgent),
    };

    await this.eventsService.intakeEvent(enrichedEvent);
    return { status: 'ok' };
  }

  private parseUserAgent(userAgent: string) {
    // Basic device detection - in production you might want to use a proper UA parser library
    const isMobile = /mobile|android|iphone|ipad|ipod/i.test(
      userAgent.toLowerCase(),
    );
    const isTablet = /tablet|ipad/i.test(userAgent.toLowerCase());

    return {
      type: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
      raw: userAgent,
    } as const;
  }
}
