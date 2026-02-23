import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { IPAPIService } from './ipapi.service';

@ApiTags('ipapi location API v1')
@Controller({ path: 'ipapi', version: '1' })
export class IPAPIController {
  constructor(private readonly ipapiService: IPAPIService) {}

  @Get('json')
  @ApiOperation({ summary: 'Get location data in JSON format' })
  @ApiQuery({
    name: 'isTest',
    required: false,
    type: String,
    description:
      'Optional test flag, set to "true" for it to return Google location (8.8.8.8)',
  })
  @ApiResponse({
    status: 200,
    description: 'Location data returned successfully.',
    content: {
      'application/json': {
        example: {
          latitude: 37.42301,
          longitude: -122.083352,
          city: 'Mountain View',
          region: 'California',
          region_code: 'CA',
          country_name: 'United States',
          country_code: 'US',
        },
      },
    },
  })
  async getLocationJSON(@Query('isTest') isTest?: string): Promise<unknown> {
    return this.ipapiService.getLocationJSON(isTest);
  }
}
