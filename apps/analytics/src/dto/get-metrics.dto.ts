import { IsNumber, IsDateString, IsOptional, IsArray } from 'class-validator';

export class GetMetricsDto {
  @IsNumber()
  siteId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsArray()
  dimensions?: string[];
}
