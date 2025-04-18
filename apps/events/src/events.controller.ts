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
    @Headers('accept-language') acceptLanguage: string,
    @Ip() ip: string,
  ) {
    const location = this.extractLocation(eventDto.metadata, acceptLanguage);

    // Enrich event with additional data
    const enrichedEvent: EnrichedEventDto = {
      ...eventDto,
      triggered_at: new Date(),
      timestamp: new Date(),
      ip_address: ip,
      user_agent: userAgent,
      device_info: this.parseUserAgent(userAgent),
      location,
    };

    await this.eventsService.intakeEvent(enrichedEvent);
    return { status: 'ok' };
  }

  private extractLocation(
    metadata?: Record<string, any>,
    acceptLanguage?: string,
  ): string {
    if (metadata?.language) {
      const [, country] = metadata.language.split('-');
      if (country) {
        return country.toUpperCase();
      }
    }

    if (acceptLanguage) {
      const languages = acceptLanguage.split(',');
      const primaryLang = languages[0].trim().split(';')[0]; // Pega a primeira língua e remove o q-factor
      const [lang, country] = primaryLang.split('-');
      if (country) {
        return country.toUpperCase();
      }

      const languageToCountry = {
        pt: 'BR',
        en: 'US',
        es: 'ES',
        fr: 'FR',
        de: 'DE',
        it: 'IT',
        ja: 'JP',
        ko: 'KR',
        zh: 'CN',
      };
      return languageToCountry[lang] || 'Unknown';
    }

    return 'Unknown';
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
