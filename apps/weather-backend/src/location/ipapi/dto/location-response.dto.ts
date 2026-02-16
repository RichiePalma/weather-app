import { IsLatitude, IsLongitude, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class LocationResponseDto {
  @Expose()
  @IsLatitude()
  latitude: number;

  @Expose()
  @IsLongitude()
  longitude: number;

  @Expose()
  @IsString()
  city: string;

  @Expose()
  @IsString()
  region: string;

  @Expose()
  @IsString()
  region_code: string;

  @Expose()
  @IsString()
  country_name: string;

  @Expose()
  @IsString()
  country_code: string;

  constructor(params: LocationResponseDto) {
    Object.assign(this, params);
  }
}
