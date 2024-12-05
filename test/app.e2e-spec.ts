import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module'; // Adjust path as needed
import { INestApplication } from '@nestjs/common';
import exp from 'constants';

/**
 * 1
 * usr1 manda invitaicon
 * usr2 ve listado de invitaciones y encuentra la nueva
 * usr2 acepta invitacion
 * usr1 ve listado de amigos y encuentra el nuevo
 *  
 * 3
 * usr1 crea un regalo
 * usr2 encuentra regalo creado por usr1
 * usr2 agrega un pago a regalo de usr1
 * usr1 ve pago de usr2
 * 
 */

describe('Friends Endpoint (e2e)', () => {
  //let app: INestApplication;
  let receiverToken, senderToken: string;

  beforeAll(async () => {
    /*const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();*/

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
    console.log("SENDER: " + senderToken);

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
    console.log("RECEIVER: " + receiverToken);
  });

  it('test', async () => {
    expect(true).toBe(true);
    /*const { text: invitationResponse} = await request("http://localhost:3000")
      .post('/friend-invitations')
      .set('Authorization', `Bearer ${senderToken}`)
      .send({
        receiver: '19'
      })
      .expect(201);

      console.log(invitationResponse);*/

    /*const { text: approvalResponse } = await request("http://localhost:3000")
      .post('/friend-invitations/approve')
      .set('Authorization', `Bearer ${receiverToken}`)
      .send({
        sender: '20'
      })
      .expect(201);

      console.log(approvalResponse);*/
  });

  afterAll(async () => {
    //await app.close();
  });
});
