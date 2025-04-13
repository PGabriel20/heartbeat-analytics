import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Site } from './entities/site.entity';
import { Session } from './entities/session.entity';
import { Visitor } from './entities/visitor.entity';
import { Event } from './entities/event.entity';
import { Metric } from './entities/metric.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'heartbeat',
      password: process.env.DB_PASSWORD || 'heartbeat123',
      database: process.env.DB_NAME || 'heartbeat_analytics',
      entities: [Site, Session, Visitor, Event, Metric],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      synchronize: false,
      migrationsRun: true,
    }),
    TypeOrmModule.forFeature([Site, Session, Visitor, Event, Metric]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
