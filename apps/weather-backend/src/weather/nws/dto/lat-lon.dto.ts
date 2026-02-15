import { IsLatitude, IsLongitude } from 'class-validator';

export class LatLonDto {
  @IsLatitude({ message: 'lat must be a valid number between -90 and 90' })
  lat: string;

  @IsLongitude({ message: 'lon must be a valid number between -180 and 180' })
  lon: string;
}
