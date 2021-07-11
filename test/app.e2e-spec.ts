import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Queries } from './Queries';

const gql = '/graphql';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('series query', () => {
    return request(app.getHttpServer())
      .post(gql)
      .send({
        query: Queries.series,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.series.id).toBe(33);
      });
  });
});
