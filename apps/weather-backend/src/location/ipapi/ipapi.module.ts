import { Module } from '@nestjs/common';
import { IPAPIController } from './ipapi.controller';
import { IPAPIService } from './ipapi.service';

@Module({
  imports: [],
  controllers: [IPAPIController],
  providers: [IPAPIService],
})
export class IPAPIModule {}
