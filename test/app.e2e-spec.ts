import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module'; // Adjust path as needed
import { INestApplication } from '@nestjs/common';

describe('Friends Endpoint (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get the token from Auth0
    const response = await request('https://dev-wbwcoejrz0zdw4rp.us.auth0.com')
      .post('/oauth/token')
      .send({
        grant_type: 'client_credentials',
        client_id: 'QTecouGUNCNaGicR35DBsuKaa3HH4VEh',
        client_secret:
          'VVR96KR9-dl09vFVMi7zCuiWZ4WmXRMrt0H952xIG28LvPSd0o__y5dc9jGh5pSL',
        audience: 'https://bow-api.com',
      })
      .expect(200);

    token = (response.body as { access_token: string }).access_token;
    console.log(token);
  });

  it('should return 200', async () => {
    const response = await request(app.getHttpServer())
      .get('/friend-invitations')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    console.log(response.body);
  });

  afterAll(async () => {
    await app.close();
  });
});
