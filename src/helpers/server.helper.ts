import { INestApplication } from '@nestjs/common';

export function configureServerTimeouts(app: INestApplication): void {
  const server = app.getHttpServer();
  server.keepAliveTimeout = 25000;
  server.headersTimeout = 26000;
}

export function configureServerErrorHandlers(app: INestApplication): void {
  const server = app.getHttpServer();
  
  server.on('clientError', (err: any, socket: any) => {
    if (err.code === 'ECONNRESET' || !socket.writable) {
      socket.destroy();
      return;
    }
    
    socket.destroy(err);
  });
  
  server.on('tlsClientError', () => {
    // Ignore handshake TLS errors
  });
}

