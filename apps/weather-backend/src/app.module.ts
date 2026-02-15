import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { NwsModule } from './weather/nws/nws.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NwsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
