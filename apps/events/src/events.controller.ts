import { Controller, Post, Body, Headers, Ip } from '@nestjs/common';
import { EventsService } from './events.service';
import { BaseEventDto } from '@app/common';

@Controller('intake')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async intakeEvent(
    @Body() eventDto: BaseEventDto,
    @Headers('user-agent') userAgent: string,
    @Headers('accept-language') acceptLanguage: string,
    @Headers('referer') refererUrl: string,
    @Ip() ip: string,
  ) {
    await this.eventsService.intakeEvent(eventDto, {
      userAgent,
      acceptLanguage,
      refererUrl,
      ip,
    });
    return { status: 'ok' };
  }
}
