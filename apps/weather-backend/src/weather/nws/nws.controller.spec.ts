import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { NwsController } from './nws.controller';
import { NwsService } from './nws.service';

describe('NwsController (Integration)', () => {
  let app: INestApplication;

  const mockNwsService = {
    fetchNwsData: jest.fn(),
    fetchReturnedEndpoints: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NwsController],
      providers: [
        {
          provide: NwsService,
          useValue: mockNwsService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  describe('GET /nws/points/:lat,:lon', () => {
    it('should return points data with valid coordinates', () => {
      const mockData = { properties: { gridId: 'TOP' } };
      mockNwsService.fetchNwsData.mockResolvedValue(mockData);

      return request(
        app.getHttpServer() as unknown as import('express').Application,
      )
        .get('/nws/points/39.7456,-97.0892')
        .expect(200)
        .expect(mockData);
    });

    it('should reject invalid latitude', () => {
      return request(
        app.getHttpServer() as unknown as import('express').Application,
      )
        .get('/nws/points/100,-97.0892')
        .expect(400)
        .expect((res: request.Response) => {
          expect((res.body as { message: string[] }).message).toContain(
            'lat must be a valid number between -90 and 90',
          );
        });
    });

    it('should reject invalid longitude', () => {
      return request(
        app.getHttpServer() as unknown as import('express').Application,
      )
        .get('/nws/points/39,-200')
        .expect(400)
        .expect((res: request.Response) => {
          expect((res.body as { message: string[] }).message).toContain(
            'lon must be a valid number between -180 and 180',
          );
        });
    });
  });
});
