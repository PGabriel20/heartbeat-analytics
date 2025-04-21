import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseEventDto, EnrichedEventDto } from '@app/common';

interface RequestContext {
  userAgent: string;
  acceptLanguage: string;
  refererUrl: string;
  ip: string;
}

@Injectable()
export class EventsService {
  constructor(
    @Inject('ANALYTICS_SERVICE') private readonly analyticsClient: ClientProxy,
  ) {}

  async intakeEvent(eventDto: BaseEventDto, context: RequestContext) {
    const location = this.extractLocation(
      eventDto.metadata,
      context.acceptLanguage,
    );
    const deviceInfo = this.parseUserAgent(context.userAgent);

    const enrichedEvent: EnrichedEventDto = {
      ...eventDto,
      triggered_at: new Date(),
      timestamp: new Date(),
      ip_address: context.ip,
      user_agent: context.userAgent,
      referrer_url: context.refererUrl,
      device_info: deviceInfo,
      location,
      browser: this.extractBrowser(context.userAgent),
      operating_system: this.extractOperatingSystem(context.userAgent),
    };

    console.log(enrichedEvent);

    await this.analyticsClient.emit('event_created', enrichedEvent);
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
      const primaryLang = languages[0].trim().split(';')[0];
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
    const isMobile = /mobile|android|iphone|ipad|ipod/i.test(
      userAgent.toLowerCase(),
    );
    const isTablet = /tablet|ipad/i.test(userAgent.toLowerCase());

    return {
      type: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
      raw: userAgent,
    } as const;
  }

  private extractBrowser(userAgent: string): string {
    const browserRegexes = {
      chrome: /Chrome\/([0-9.]+)/,
      firefox: /Firefox\/([0-9.]+)/,
      safari: /Version\/([0-9.]+).*Safari/,
      edge: /Edg\/([0-9.]+)/,
      opera: /OPR\/([0-9.]+)/,
    };

    for (const [browser, regex] of Object.entries(browserRegexes)) {
      const match = userAgent.match(regex);
      if (match) {
        return `${browser.charAt(0).toUpperCase() + browser.slice(1)} ${match[1]}`;
      }
    }

    return 'Unknown';
  }

  private extractOperatingSystem(userAgent: string): string {
    const osRegexes = {
      windows: /Windows NT ([0-9.]+)/,
      mac: /Mac OS X ([0-9._]+)/,
      linux: /Linux/,
      android: /Android ([0-9.]+)/,
      ios: /iPhone OS ([0-9._]+)/,
    };

    for (const [os, regex] of Object.entries(osRegexes)) {
      const match = userAgent.match(regex);
      if (match) {
        if (os === 'mac') {
          return `Mac OS ${match[1].replace(/_/g, '.')}`;
        }
        if (os === 'ios') {
          return `iOS ${match[1].replace(/_/g, '.')}`;
        }
        return `${os.charAt(0).toUpperCase() + os.slice(1)} ${match[1] || ''}`.trim();
      }
    }

    return 'Unknown';
  }
}
