import { Controller, Get, Param } from '@nestjs/common';
import { NwsService } from './nws.service';
import { LatLonDto } from './dto/lat-lon.dto';
import { PointsResponseDto } from './dto/points-response.dto';
import { ForecastDto } from './dto/forecast.dto';
import { plainToInstance } from 'class-transformer';
import { ForecastPropertiesDto } from './dto/forecast-properties.dto';
import { ForecastPeriodDto } from './dto/forecast-period.dto';

@Controller('nws')
export class NwsController {
  constructor(private readonly nwsService: NwsService) {}

  private async fetchHourlyForecast(params: LatLonDto): Promise<unknown> {
    const pointsData = (await this.nwsService.fetchNwsData(
      `/points/${params.lat},${params.lon}`,
    )) as PointsResponseDto;
    const forecastHourly = this.nwsService.fetchReturnedEndpoints(
      pointsData?.forecastHourly,
    );
    return plainToInstance(ForecastDto, forecastHourly, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  getHello(): string {
    return this.nwsService.getHello();
  }

  @Get('alerts')
  async getAlerts(): Promise<unknown> {
    return this.nwsService.fetchNwsData('/alerts');
  }

  @Get('/points/:lat,:lon')
  async getPoints(@Param() params: LatLonDto): Promise<unknown> {
    return this.nwsService.fetchNwsData(`/points/${params.lat},${params.lon}`);
  }

  @Get('/points/:lat,:lon/forecast')
  async getForecastByPoints(@Param() params: LatLonDto): Promise<unknown> {
    const pointsData = (await this.nwsService.fetchNwsData(
      `/points/${params.lat},${params.lon}`,
    )) as PointsResponseDto;
    const forecast = this.nwsService.fetchReturnedEndpoints(
      pointsData?.forecast,
    );
    return plainToInstance(ForecastDto, forecast, {
      excludeExtraneousValues: true,
    });
  }

  @Get('/points/:lat,:lon/forecast/hourly')
  async getForecastHourlyByPoints(
    @Param() params: LatLonDto,
  ): Promise<unknown> {
    return this.fetchHourlyForecast(params);
  }

  @Get('/points/:lat,:lon/forecast/current')
  async getCurrentForecastByPoints(
    @Param() params: LatLonDto,
  ): Promise<unknown> {
    const now = new Date();
    const hourlyForecast = (await this.fetchHourlyForecast(
      params,
    )) as ForecastDto;
    const forecastProperties = plainToInstance(
      ForecastPropertiesDto,
      hourlyForecast.properties,
      {
        excludeExtraneousValues: true,
      },
    );

    return forecastProperties.periods.filter((p: ForecastPeriodDto) => {
      return new Date(p.endTime) > now;
    });
  }
}
