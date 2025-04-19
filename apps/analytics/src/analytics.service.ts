import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { Site } from './entities/site.entity';
import { Session } from './entities/session.entity';
import { Visitor } from './entities/visitor.entity';
import { Event } from './entities/event.entity';
import { Metric } from './entities/metric.entity';
import { EnrichedEventDto } from '@app/common';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
    @InjectRepository(Visitor)
    private visitorRepository: Repository<Visitor>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Metric)
    private metricRepository: Repository<Metric>,
  ) {}

  async processEvent(event: EnrichedEventDto) {
    console.log({ event });

    // 1. Ensure site exists
    let site = await this.siteRepository.findOne({
      where: { domain: event.domain },
    });
    if (!site) {
      site = await this.siteRepository.save({
        domain: event.domain,
      });
    }

    // // 2. Update or create visitor
    let visitor = await this.visitorRepository.findOne({
      where: { siteId: site.id, externalId: event.visitor_id },
    });

    if (!visitor) {
      visitor = await this.visitorRepository.save({
        siteId: site.id,
        externalId: event.visitor_id,
        firstSeen: new Date(event.timestamp),
        lastSeen: new Date(event.timestamp),
        device: {
          userAgent: event.user_agent,
          type: event.device_info?.type,
        },
      });
    } else {
      await this.visitorRepository.update(visitor.id, {
        lastSeen: new Date(event.timestamp),
      });
    }

    // // 3. Update or create session
    let session = await this.sessionRepository.findOne({
      where: { siteId: site.id, externalId: event.session_id },
    });

    if (!session) {
      session = await this.sessionRepository.save({
        siteId: site.id,
        visitorId: visitor.id,
        externalId: event.session_id,
        duration: 0,
      });
    }

    // // 4. Save event
    await this.eventRepository.save({
      siteId: site.id,
      sessionId: session.id,
      visitorId: visitor.id,
      eventType: event.event_type,
      referrerUrl: event.referrer_url,
      browser: event.user_agent,
      screenSize: event.screen_size,
      operatingSystem: event.operating_system,
      deviceType: event.device_info.type,
      pageUrl: event.page_url,
      location: event.location,
      triggeredAt: event.triggered_at,
    });

    // // 5. Calculate and update metrics
    await this.calculateMetrics(site.id);
  }

  private async calculateMetrics(siteId: number) {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    // Base metrics (without segmentation)
    const baseMetrics = await this.calculateBaseMetrics(
      siteId,
      startOfDay,
      endOfDay,
    );

    // Device type segmentation
    const deviceMetrics = await this.calculateDeviceSegmentation(
      siteId,
      startOfDay,
      endOfDay,
    );

    // Location segmentation
    const locationMetrics = await this.calculateLocationSegmentation(
      siteId,
      startOfDay,
      endOfDay,
    );

    // Page segmentation
    const pageMetrics = await this.calculatePageSegmentation(
      siteId,
      startOfDay,
      endOfDay,
    );

    console.log(deviceMetrics, locationMetrics, pageMetrics);

    // Save all metrics
    await this.metricRepository.save({
      siteId,
      value: {
        timestamp: now.toISOString(),
        ...baseMetrics,
        segments: {
          device: deviceMetrics,
          location: locationMetrics,
          page: pageMetrics,
        },
      },
    });
  }

  private async calculateBaseMetrics(
    siteId: number,
    startDate: Date,
    endDate: Date,
  ) {
    // Calculate pageviews
    const pageviews = await this.eventRepository.count({
      where: {
        siteId,
        eventType: 'pageview',
        triggeredAt: Between(startDate, endDate),
      },
    });

    // Calculate unique visitors
    const uniqueVisitors = await this.visitorRepository.count({
      where: {
        siteId,
        firstSeen: Between(startDate, endDate),
      },
    });

    // Calculate total sessions
    const totalSessions = await this.sessionRepository.count({
      where: {
        siteId,
        createdAt: Between(startDate, endDate),
      },
    });

    // Calculate bounce rate
    const bounceSessions = await this.sessionRepository
      .createQueryBuilder('session')
      .where('session.site_id = :siteId', { siteId })
      .andWhere('session.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('COUNT(*)')
          .from(Event, 'event')
          .where('event.session_id = session.id')
          .getQuery();
        return `(${subQuery}) = 1`;
      })
      .getCount();

    const bounceRate =
      totalSessions > 0 ? (bounceSessions / totalSessions) * 100 : 0;

    // Calculate average session duration
    const sessions = await this.sessionRepository.find({
      where: {
        siteId,
        createdAt: Between(startDate, endDate),
      },
      relations: ['events'],
    });

    let totalDuration = 0;
    sessions.forEach((session) => {
      totalDuration += session.duration;
    });
    const avgSessionDuration =
      sessions.length > 0 ? totalDuration / sessions.length : 0;

    return {
      pageviews,
      uniqueVisitors,
      totalSessions,
      bounceRate,
      avgSessionDuration,
    };
  }

  private async calculateDeviceSegmentation(
    siteId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const deviceTypes = ['mobile', 'tablet', 'desktop'];
    const metrics = {};

    for (const deviceType of deviceTypes) {
      // Get visitors by device type
      const visitors = await this.visitorRepository.find({
        where: {
          siteId,
          device: { type: deviceType },
          firstSeen: Between(startDate, endDate),
        },
      });

      const visitorIds = visitors.map((v) => v.id);

      // Get sessions for these visitors
      const sessions = await this.sessionRepository.find({
        where: { visitorId: In(visitorIds) },
        relations: ['events'],
      });

      // Calculate metrics for this device type
      let totalDuration = 0;
      // const totalPageviews = 0;
      const uniqueVisitors = visitors.length;
      const totalSessions = sessions.length;

      sessions.forEach((session) => {
        totalDuration += session.duration;
      });

      const avgSessionDuration =
        sessions.length > 0 ? totalDuration / sessions.length : 0;

      metrics[deviceType] = {
        uniqueVisitors,
        totalSessions,
        avgSessionDuration,
      };
    }

    return metrics;
  }

  private async calculateLocationSegmentation(
    siteId: number,
    startDate: Date,
    endDate: Date,
  ) {
    // Get all unique locations
    const locations = await this.eventRepository
      .createQueryBuilder('event')
      .select('DISTINCT event.location')
      .where('event.siteId = :siteId', { siteId })
      .andWhere('event.location IS NOT NULL')
      .andWhere('event.triggeredAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawMany();

    const metrics = {};

    for (const { location } of locations) {
      const events = await this.eventRepository.find({
        where: {
          siteId,
          location,
          triggeredAt: Between(startDate, endDate),
        },
        relations: ['session', 'visitor'],
      });

      const uniqueVisitors = new Set(events.map((e) => e.visitorId)).size;
      const sessions = new Set(events.map((e) => e.sessionId));
      const totalSessions = sessions.size;

      let totalDuration = 0;
      for (const sessionId of sessions) {
        const session = await this.sessionRepository.findOne({
          where: {
            id: sessionId,
            createdAt: Between(startDate, endDate),
          },
        });
        if (session) {
          totalDuration += session.duration;
        }
      }

      const avgSessionDuration =
        totalSessions > 0 ? totalDuration / totalSessions : 0;

      metrics[location] = {
        uniqueVisitors,
        totalSessions,
        avgSessionDuration,
      };
    }

    return metrics;
  }

  private async calculatePageSegmentation(
    siteId: number,
    startDate: Date,
    endDate: Date,
  ) {
    // Get all unique pages
    const pages = await this.eventRepository
      .createQueryBuilder('event')
      .select('DISTINCT event.page_url')
      .where('event.siteId = :siteId', { siteId })
      .andWhere('event.eventType = :eventType', { eventType: 'pageview' })
      .andWhere('event.triggeredAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawMany();

    const metrics = {};

    for (const { page_url } of pages) {
      const pageEvents = await this.eventRepository.find({
        where: {
          siteId,
          eventType: 'pageview',
          pageUrl: page_url,
          triggeredAt: Between(startDate, endDate),
        },
        relations: ['session', 'visitor'],
      });

      const uniqueVisitors = new Set(pageEvents.map((e) => e.visitorId)).size;
      const sessions = new Set(pageEvents.map((e) => e.sessionId));
      const totalSessions = sessions.size;
      const pageviews = pageEvents.length;

      // Calculate average time on page
      let totalTimeOnPage = 0;
      let validTimeOnPageCount = 0;

      for (const event of pageEvents) {
        const nextEvent = await this.eventRepository.findOne({
          where: {
            sessionId: event.sessionId,
            triggeredAt: Between(event.triggeredAt, endDate),
          },
          order: { triggeredAt: 'ASC' },
        });

        if (nextEvent) {
          const timeOnPage =
            nextEvent.triggeredAt.getTime() - event.triggeredAt.getTime();
          totalTimeOnPage += timeOnPage;
          validTimeOnPageCount++;
        }
      }

      const avgTimeOnPage =
        validTimeOnPageCount > 0 ? totalTimeOnPage / validTimeOnPageCount : 0;

      metrics[page_url] = {
        pageviews,
        uniqueVisitors,
        totalSessions,
        avgTimeOnPage,
      };
    }

    return metrics;
  }

  async getMetrics(
    siteId: number,
    startDate: Date,
    endDate: Date,
    dimensions?: string[],
  ) {
    // Get metrics within the date range
    const metrics = await this.metricRepository.find({
      where: {
        siteId,
        createdAt: Between(startDate, endDate),
      },
      order: {
        createdAt: 'ASC',
      },
    });

    // If no metrics found
    if (!metrics || metrics.length === 0) {
      return {
        timeRange: {
          start: startDate,
          end: endDate,
        },
        metrics: [],
      };
    }

    // Process metrics for the time range
    const processedMetrics = metrics.map((metric) => {
      const result: any = {
        timestamp: metric.value.timestamp,
        metrics: {
          pageviews: metric.value.pageviews,
          uniqueVisitors: metric.value.uniqueVisitors,
          totalSessions: metric.value.totalSessions,
          bounceRate: metric.value.bounceRate,
          avgSessionDuration: metric.value.avgSessionDuration,
        },
      };

      // Add requested dimension segments
      if (dimensions && dimensions.length > 0) {
        result.segments = {};
        dimensions.forEach((dimension) => {
          if (metric.value.segments && metric.value.segments[dimension]) {
            result.segments[dimension] = metric.value.segments[dimension];
          }
        });
      }

      return result;
    });

    // Calculate aggregated metrics for the entire period
    const aggregatedMetrics = this.aggregateMetrics(processedMetrics);

    return {
      timeRange: {
        start: startDate,
        end: endDate,
      },
      metrics: processedMetrics,
      aggregated: aggregatedMetrics,
    };
  }

  private aggregateMetrics(metrics: any[]) {
    const aggregated = {
      pageviews: 0,
      uniqueVisitors: new Set<string>(),
      totalSessions: 0,
      bounceRate: 0,
      avgSessionDuration: 0,
    };

    metrics.forEach((metric) => {
      aggregated.pageviews += metric.metrics.pageviews;
      // Assuming uniqueVisitors in each metric contains unique IDs
      metric.metrics.uniqueVisitors.forEach((visitor: string) =>
        aggregated.uniqueVisitors.add(visitor),
      );
      aggregated.totalSessions += metric.metrics.totalSessions;
      aggregated.avgSessionDuration += metric.metrics.avgSessionDuration;
    });

    // Calculate averages
    if (metrics.length > 0) {
      aggregated.bounceRate =
        metrics.reduce((acc, curr) => acc + curr.metrics.bounceRate, 0) /
        metrics.length;
      aggregated.avgSessionDuration =
        aggregated.avgSessionDuration / metrics.length;
    }

    // Convert Set to count for uniqueVisitors
    const uniqueVisitorsCount = aggregated.uniqueVisitors.size;
    return {
      ...aggregated,
      uniqueVisitors: uniqueVisitorsCount,
    };
  }
}
