import { IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class PrecipitationProbabilityDto {
  @Expose()
  @IsString()
  unitCode: string;

  @Expose()
  @IsNumber()
  value: number;

  constructor(params: PrecipitationProbabilityDto) {
    Object.assign(this, params);
  }
}
