import { Controller, Get, Param } from '@nestjs/common';
import { NwsService } from './nws.service';
import { LatLonDto } from './dto/lat-lon.dto';
import { PointsResponseDto } from './dto/points-response.dto';
import { ForecastDto } from './dto/forecast.dto';
import { plainToInstance } from 'class-transformer';
import { ForecastPropertiesDto } from './dto/forecast-properties.dto';
import { ForecastPeriodDto } from './dto/forecast-period.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('National Weather Service API v1')
@Controller({ path: 'nws', version: '1' })
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

  @Get('/points/:lat,:lon')
  @ApiOperation({
    summary: 'Get Point data such as forecast endpoints and grid information',
  })
  @ApiResponse({
    status: 200,
    description: 'Point data returned successfully.',
    content: {
      'application/json': {
        example: {
          forecastOffice: 'https://api.weather.gov/offices/MTR',
          gridId: 'MTR',
          gridX: 93,
          gridY: 87,
          forecast: 'https://api.weather.gov/gridpoints/MTR/93,87/forecast',
          forecastHourly:
            'https://api.weather.gov/gridpoints/MTR/93,87/forecast/hourly',
          forecastGridData: 'https://api.weather.gov/gridpoints/MTR/93,87',
        },
      },
    },
  })
  async getPoints(@Param() params: LatLonDto): Promise<unknown> {
    return this.nwsService.fetchNwsData(`/points/${params.lat},${params.lon}`);
  }

  @Get('/points/:lat,:lon/forecast')
  @ApiOperation({ summary: 'Get weekly forecast' })
  @ApiResponse({
    status: 200,
    description: 'Weekly forecast returned successfully.',
    content: {
      'application/json': {
        example: {
          type: 'Feature',
          properties: {
            generatedAt: '2026-02-16T15:07:46+00:00',
            updateTime: '2026-02-16T09:55:15+00:00',
            periods: [
              {
                number: 1,
                name: "Washington's Birthday",
                startTime: '2026-02-16T07:00:00-08:00',
                endTime: '2026-02-16T18:00:00-08:00',
                temperature: 52,
                temperatureUnit: 'F',
                windSpeed: '7 to 14 mph',
                windDirection: 'NW',
                shortForecast: 'Rain',
                probabilityOfPrecipitation: {
                  unitCode: 'wmoUnit:percent',
                  value: 99,
                },
              },
            ],
          },
        },
      },
    },
  })
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
  @ApiOperation({ summary: 'Get hourly forecast' })
  @ApiResponse({
    status: 200,
    description: 'Hourly forecast returned successfully.',
    content: {
      'application/json': {
        example: {
          type: 'Feature',
          properties: {
            generatedAt: '2026-02-16T15:07:46+00:00',
            updateTime: '2026-02-16T09:55:15+00:00',
            periods: [
              {
                number: 1,
                name: '',
                startTime: '2026-02-16T07:00:00-08:00',
                endTime: '2026-02-16T18:00:00-08:00',
                temperature: 52,
                temperatureUnit: 'F',
                windSpeed: '7 to 14 mph',
                windDirection: 'NW',
                shortForecast: 'Rain',
                probabilityOfPrecipitation: {
                  unitCode: 'wmoUnit:percent',
                  value: 99,
                },
              },
            ],
          },
        },
      },
    },
  })
  async getForecastHourlyByPoints(
    @Param() params: LatLonDto,
  ): Promise<unknown> {
    return this.fetchHourlyForecast(params);
  }

  @Get('/points/:lat,:lon/forecast/current')
  @Get('/points/:lat,:lon/forecast/hourly')
  @ApiOperation({ summary: 'Get hourly forecast after current time' })
  @ApiResponse({
    status: 200,
    description: 'Hourly current forecast returned successfully.',
    content: {
      'application/json': {
        example: {
          type: 'Feature',
          properties: {
            generatedAt: '2026-02-16T15:07:46+00:00',
            updateTime: '2026-02-16T09:55:15+00:00',
            periods: [
              {
                number: 1,
                name: '',
                startTime: '2026-02-16T07:00:00-08:00',
                endTime: '2026-02-16T18:00:00-08:00',
                temperature: 52,
                temperatureUnit: 'F',
                windSpeed: '7 to 14 mph',
                windDirection: 'NW',
                shortForecast: 'Rain',
                probabilityOfPrecipitation: {
                  unitCode: 'wmoUnit:percent',
                  value: 99,
                },
              },
            ],
          },
        },
      },
    },
  })
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
