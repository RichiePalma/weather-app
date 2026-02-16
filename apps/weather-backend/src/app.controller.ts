import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Base Hello World url to test connectivity' })
  @ApiResponse({
    status: 200,
    description: 'Service working properly.',
    content: {
      'text/plain': {
        example: 'Hello World',
      },
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
