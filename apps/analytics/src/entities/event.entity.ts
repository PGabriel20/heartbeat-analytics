import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Site } from './site.entity';
import { Session } from './session.entity';
import { Visitor } from './visitor.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'site_id' })
  siteId: string;

  @ManyToOne(() => Site)
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @Column({ name: 'session_id' })
  sessionId: string;

  @ManyToOne(() => Session)
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @Column({ name: 'visitor_id' })
  visitorId: string;

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

  @Column({ nullable: true })
  location: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 