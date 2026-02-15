import { Module } from '@nestjs/common';
import { NwsController } from './nws.controller';
import { NwsService } from './nws.service';

@Module({
  imports: [],
  controllers: [NwsController],
  providers: [NwsService],
})
export class NwsModule {}
