import { IsObject, IsOptional, IsString, IsUrl } from "class-validator";

export class EventDto {
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