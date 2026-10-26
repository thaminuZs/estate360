import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

export class ConfigureIotCloudDto {
  @IsOptional()
  @IsUrl({ require_tld: false })
  apiUrl?: string;

  @IsOptional()
  @IsString()
  apiKey?: string;

  @IsOptional()
  @IsString()
  workerReadingsPath?: string;

  @IsOptional()
  @IsString()
  environmentReadingsPath?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
