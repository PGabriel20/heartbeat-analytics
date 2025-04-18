import { IsString, IsDateString, IsOptional, IsArray } from 'class-validator';

export class GetMetricsDto {
  @IsString()
  siteId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dimensions?: string[]; // ['device', 'location', 'page']
}
