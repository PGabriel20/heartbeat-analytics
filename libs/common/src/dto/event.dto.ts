import { IsObject, IsOptional, IsString, IsUrl, IsDate } from 'class-validator';

export class BaseEventDto {
  @IsString()
  event_type: string;

  @IsString()
  visitor_id: string;

  @IsString()
  session_id: string;

  @IsString()
  domain: string;

  @IsString()
  @IsUrl()
  page_url: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  referrer_url?: string;

  @IsString()
  @IsOptional()
  browser?: string;

  @IsString()
  @IsOptional()
  screen_size?: string;

  @IsString()
  @IsOptional()
  operating_system?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class EnrichedEventDto extends BaseEventDto {
  @IsDate()
  triggered_at: Date;

  @IsDate()
  timestamp: Date;

  @IsString()
  ip_address: string;

  @IsString()
  user_agent: string;

  @IsObject()
  device_info: {
    type: 'mobile' | 'tablet' | 'desktop';
    raw: string;
  };
}
