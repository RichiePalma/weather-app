import { IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class PointsResponseDto {
  @Expose()
  @IsString()
  forecastOffice: string;

  @Expose()
  @IsString()
  gridId: string;

  @Expose()
  @IsNumber()
  gridX: number;

  @Expose()
  @IsNumber()
  gridY: number;

  @Expose()
  @IsString()
  forecast: string;

  @Expose()
  @IsString()
  forecastHourly: string;

  @Expose()
  @IsString()
  forecastGridData: string;

  constructor(params: PointsResponseDto) {
    Object.assign(this, params);
  }
}
