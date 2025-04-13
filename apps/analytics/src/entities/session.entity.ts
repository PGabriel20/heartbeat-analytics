import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Site } from './site.entity';
import { Visitor } from './visitor.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'site_id' })
  siteId: string;

  @ManyToOne(() => Site)
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @Column({ name: 'visitor_id' })
  visitorId: string;

  @ManyToOne(() => Visitor)
  @JoinColumn({ name: 'visitor_id' })
  visitor: Visitor;

  @Column({ name: 'external_id' })
  externalId: string;

  @Column()
  duration: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 