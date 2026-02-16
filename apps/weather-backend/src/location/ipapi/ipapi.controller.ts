import { Controller, Get, Query } from '@nestjs/common';
import { IPAPIService } from './ipapi.service';

@Controller('ipapi')
export class IPAPIController {
  constructor(private readonly ipapiService: IPAPIService) {}

  @Get('json')
  async getLocationJSON(@Query('isTest') isTest?: string): Promise<unknown> {
    return this.ipapiService.getLocationJSON(isTest);
  }
}
