import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { PointsResponseDto } from './dto/points-response.dto';

@Injectable()
export class NwsService {
  private readonly contactEmail: string;
  private readonly contactUrl: string;
  private readonly baseUrl: string;
  private readonly defaultTimeout: number;
  private readonly logger = new Logger(NwsService.name);

  constructor(private readonly configService: ConfigService) {
    this.contactEmail =
      this.configService.getOrThrow<string>('NWS_CONTACT_EMAIL');
    this.contactUrl = this.configService.getOrThrow<string>('NWS_CONTACT_URL');
    this.baseUrl = this.configService.getOrThrow<string>('NWS_BASE_URL');
    this.defaultTimeout = this.configService.get<number>('NWS_TIMEOUT', 30000);
  }

  async fetchNwsData(path: string, timeout?: number): Promise<unknown> {
    const timeoutMs = timeout ?? this.defaultTimeout;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    this.logger.log(`GET: ${path}`);

    try {
      const response = await fetch(this.baseUrl + path, {
        headers: {
          'User-Agent': `(${this.contactUrl}, ${this.contactEmail})`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new BadRequestException(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as Record<string, unknown>;

      if (!data || !data.properties) {
        throw new InternalServerErrorException(
          'NWS response is null or missing properties',
        );
      }

      return plainToInstance(PointsResponseDto, data?.properties, {
        excludeExtraneousValues: true,
      });
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch NWS data: ${errorMessage}`);
    }
  }

  async fetchReturnedEndpoints(url: string): Promise<unknown> {
    this.logger.log(`GET: ${url}`);

    if (!url.startsWith(this.baseUrl)) {
      throw new Error('Invalid URL: must start with NWS base URL');
    }

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': `(${this.contactUrl}, ${this.contactEmail})`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch NWS data: ${errorMessage}`);
    }
  }

  getHello(): string {
    return 'Hello NWS!';
  }
}
