import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { LocationResponseDto } from './dto/location-response.dto';

@Injectable()
export class IPAPIService {
  private readonly contactEmail: string;
  private readonly contactUrl: string;
  private readonly baseUrl: string;
  private readonly defaultTimeout: number;
  private readonly logger = new Logger(IPAPIService.name);

  constructor(private readonly configService: ConfigService) {
    this.contactEmail =
      this.configService.getOrThrow<string>('NWS_CONTACT_EMAIL');
    this.contactUrl = this.configService.getOrThrow<string>('NWS_CONTACT_URL');
    this.baseUrl = this.configService.getOrThrow<string>('IPAPI_BASE_URL');
    this.defaultTimeout = this.configService.get<number>('NWS_TIMEOUT', 30000);
  }

  async getLocationJSON(isTest?: string): Promise<unknown> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.defaultTimeout);

    try {
      const url =
        isTest === 'true'
          ? `${this.baseUrl}/8.8.8.8/json`
          : `${this.baseUrl}/json`;
      this.logger.log(`GET: ${url}`);

      const response = await fetch(url, {
        headers: {
          'User-Agent': `(${this.contactUrl}, ${this.contactEmail})`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        this.logger.error(`HTTP error! status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as Record<string, unknown>;
      const dto = plainToInstance(LocationResponseDto, data, {
        excludeExtraneousValues: true,
      });
      return dto;
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(error);
      throw new Error(`Failed to fetch location data: ${errorMessage}`);
    }
  }
}
