import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module'; // Adjust path as needed
import { INestApplication } from '@nestjs/common';

describe('Friends Endpoint (e2e)', () => {
  let app: INestApplication;
  let receiverToken, senderToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { text: senderBody } = await request('https://dev-wbwcoejrz0zdw4rp.us.auth0.com')
      .post('/oauth/token')
      .send({
        grant_type: 'password',
        username: "noztalgik666+test1@gmail.com",
        password: "Devgurus123",
        client_id: 'B8M9kGTwDJSUnAYCwh7tOVlfDhx96yau',
        client_secret:
          'xObd5evrR9PzP3WjOFmDHMKnSuT5m5SN0ub-bMgoxKi7bElq-HVD-YhpqNx0-4Rw',
        connection: "Username-Password-Authentication",
        audience: 'https://bow-api.com'
      });
    
    senderToken = JSON.parse(senderBody).access_token;

    const { text: receiverBody } = await request('https://dev-wbwcoejrz0zdw4rp.us.auth0.com')
      .post('/oauth/token')
      .send({
        grant_type: 'password',
        username: "noztalgik666+test2@gmail.com",
        password: "Devgurus123",
        client_id: 'B8M9kGTwDJSUnAYCwh7tOVlfDhx96yau',
        client_secret:
          'xObd5evrR9PzP3WjOFmDHMKnSuT5m5SN0ub-bMgoxKi7bElq-HVD-YhpqNx0-4Rw',
        connection: "Username-Password-Authentication",
        audience: 'https://bow-api.com'
      });

    receiverToken = JSON.parse(receiverBody).access_token;

    const { text: deleteResponse } = await request(app.getHttpServer())
      .delete('/friends')
      .set('Authorization', `Bearer ${senderToken}`)
      .send({
        friendId: '19'
      });
  });

  it('Friend invite e2e flow \
      1. Sender creates invite\
      2. Receiver approves invite', async () => {
    const { text: invitationResponse} = await request(app.getHttpServer())
      .post('/friend-invitations')
      .set('Authorization', `Bearer ${senderToken}`)
      .send({
        receiver: '19'
      })
      .expect(201);

    console.log("Invit res " + invitationResponse);

    const { text: approvalResponse } = await request(app.getHttpServer())
      .post('/friend-invitations/approve')
      .set('Authorization', `Bearer ${receiverToken}`)
      .send({
        sender: '20'
      })
      .expect(201);
  });

  afterAll(async () => {
    //console.log("sender: " + senderToken);
    //console.log("receiver: " + receiverToken);
    await app.close();
  });
});






