import { IsNumber, IsString, IsArray, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ForecastPeriodDto } from './forecast-period.dto';

export class ForecastPropertiesDto {
  @Expose()
  @IsString()
  generatedAt: string;

  @Expose()
  @IsString()
  updateTime: string;

  @Expose()
  @IsNumber()
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ForecastPeriodDto)
  periods: ForecastPeriodDto[];

  constructor(params: ForecastPropertiesDto) {
    Object.assign(this, params);
  }
}
