import { IsNumber, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { PrecipitationProbabilityDto } from './precipitation-probability.dto';

export class ForecastPeriodDto {
  @Expose()
  @IsNumber()
  number: number;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  startTime: string;

  @Expose()
  @IsString()
  endTime: string;

  @Expose()
  @IsNumber()
  temperature: number;

  @Expose()
  @IsString()
  temperatureUnit: string;

  @Expose()
  @IsString()
  windSpeed: string;

  @Expose()
  @IsString()
  windDirection: string;

  @Expose()
  @IsString()
  shortForecast: string;

  @Expose()
  @Type(() => PrecipitationProbabilityDto)
  probabilityOfPrecipitation: PrecipitationProbabilityDto;

  constructor(params: ForecastPeriodDto) {
    Object.assign(this, params);
  }
}
