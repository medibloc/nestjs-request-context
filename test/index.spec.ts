import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { TestModule } from './test.module';

describe('RequestContextModule', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('different actor name', async () => {
    await request(app.getHttpServer()).get('/').expect(200, 'Jack-0');
    await request(app.getHttpServer()).get('/').expect(200, 'Jack-1');
  });
});
