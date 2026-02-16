import { Controller, Get, Param } from '@nestjs/common';
import { NwsService } from './nws.service';
import { LatLonDto } from './dto/lat-lon.dto';

@Controller('nws')
export class NwsController {
  constructor(private readonly nwsService: NwsService) {}

  @Get()
  getHello(): string {
    return this.nwsService.getHello();
  }

  @Get('alerts')
  async getAlerts(): Promise<unknown> {
    return this.nwsService.fetchNwsData('/alerts');
  }

  @Get('/points/:lat,:lon')
  async getForecastByPoints(@Param() params: LatLonDto): Promise<unknown> {
    return this.nwsService.fetchNwsData(`/points/${params.lat},${params.lon}`);
  }
}
