import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module'; // Adjust path as needed
import { INestApplication } from '@nestjs/common';

describe('Friends Endpoint (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    console.log()
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get the token from Auth0
    /*const response = await request('https://dev-wbwcoejrz0zdw4rp.us.auth0.com')
      .post('/oauth/token')
      .send({
        grant_type: 'client_credentials',
        client_id: 'QTecouGUNCNaGicR35DBsuKaa3HH4VEh',
        client_secret:
          'VVR96KR9-dl09vFVMi7zCuiWZ4WmXRMrt0H952xIG28LvPSd0o__y5dc9jGh5pSL',
        audience: 'https://bow-api.com',
      })
      .expect(200);*/

    const response = await request('https://dev-wbwcoejrz0zdw4rp.us.auth0.com')
      .post('/oauth/token')
      .send({
        grant_type: 'password',
        username: "noztalgik666+test1@gmail.com",
        password: "Devgurus123",
        client_id: 'B8M9kGTwDJSUnAYCwh7tOVlfDhx96yau',
        client_secret:
          'xObd5evrR9PzP3WjOFmDHMKnSuT5m5SN0ub-bMgoxKi7bElq-HVD-YhpqNx0-4Rw',
        connection: "Username-Password-Authentication"
      });
    
    console.log("RES: " + JSON.stringify(response));

    //token = (response.body as { access_token: string }).access_token;
  });

  it('should return 200', async () => {
    const response = await request(app.getHttpServer())
      .get('/friends')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
