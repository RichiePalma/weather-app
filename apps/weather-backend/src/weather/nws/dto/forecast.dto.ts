import { IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ForecastPropertiesDto } from './forecast-properties.dto';

export class ForecastDto {
  @Expose()
  @IsString()
  type: string;

  @Expose()
  @ValidateNested()
  @Type(() => ForecastPropertiesDto)
  properties: ForecastPropertiesDto;

  constructor(params: ForecastDto) {
    Object.assign(this, params);
  }
}
