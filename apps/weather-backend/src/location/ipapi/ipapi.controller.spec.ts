import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { IPAPIController } from './ipapi.controller';
import { IPAPIService } from './ipapi.service';

describe('IPAPIController (Integration)', () => {
  let app: INestApplication;

  const mockIPAPIService = {
    getLocationJSON: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IPAPIController],
      providers: [
        {
          provide: IPAPIService,
          useValue: mockIPAPIService,
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

  describe('GET /ipapi/json?isTest=true', () => {
    it('Should return Google (8.8.8.8) location data', () => {
      const mockData = {
        latitude: 37.42301,
        longitude: -122.083352,
        city: 'Mountain View',
        region: 'California',
        region_code: 'CA',
        country_name: 'United States',
        country_code: 'US',
      };
      mockIPAPIService.getLocationJSON.mockResolvedValue(mockData);

      return request(
        app.getHttpServer() as unknown as import('express').Application,
      )
        .get('/ipapi/json?isTest=true')
        .expect(200)
        .expect(mockData);
    });
  });
});
