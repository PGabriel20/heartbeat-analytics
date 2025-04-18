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

@Entity('visitors')
export class Visitor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'site_id' })
  siteId: number;

  @ManyToOne(() => Site)
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @Column({ name: 'external_id' })
  externalId: string;

  @Column({ name: 'first_seen' })
  firstSeen: Date;

  @Column({ name: 'last_seen' })
  lastSeen: Date;

  @Column('jsonb', { nullable: true })
  device: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
