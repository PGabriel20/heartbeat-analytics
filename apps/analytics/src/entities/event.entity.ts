import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Site } from './site.entity';
import { Session } from './session.entity';
import { Visitor } from './visitor.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'site_id' })
  siteId: number;

  @ManyToOne(() => Site)
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @Column({ name: 'session_id' })
  sessionId: number;

  @ManyToOne(() => Session)
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @Column({ name: 'visitor_id' })
  visitorId: number;

  @ManyToOne(() => Visitor)
  @JoinColumn({ name: 'visitor_id' })
  visitor: Visitor;

  @Column({ name: 'event_type' })
  eventType: string;

  @Column({ name: 'page_url', nullable: true })
  pageUrl: string;

  @Column({ name: 'referrer_url', nullable: true })
  referrerUrl: string;

  @Column({ nullable: true })
  browser: string;

  @Column({ name: 'screen_size', nullable: true })
  screenSize: string;

  @Column({ name: 'operating_system', nullable: true })
  operatingSystem: string;

  @Column({ name: 'device_type', nullable: true })
  deviceType: string;

  @Column({ nullable: true })
  location: string;

  @Column({ name: 'triggered_at', type: 'timestamp' })
  triggeredAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
