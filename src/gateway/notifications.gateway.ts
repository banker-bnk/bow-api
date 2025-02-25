import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { Injectable, Logger } from '@nestjs/common';
  import { CreateNotificationDto } from '../notifications/dto/create-notification.dto';
  
  @Injectable()
  @WebSocketGateway({
    cors: {
      origin: '*', // Allow all origins (Adjust this in production)
    },
  })
  export class NotificationsGateway
    implements OnGatewayConnection, OnGatewayDisconnect
  {
    @WebSocketServer()
    server: Server;
  
    private logger: Logger = new Logger('NotificationsGateway');
  
    // Handle client connection
    handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`);
    }
  
    // Handle client disconnection
    handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  
    // Subscribe a user to a room for personalized notifications
    @SubscribeMessage('joinRoom')
    handleJoinRoom(
      @MessageBody('userId') userId: number,
      @ConnectedSocket() client: Socket,
    ) {
      client.join(`user-${userId}`);
      this.logger.log(`User ${userId} joined room: user-${userId}`);
    }
  
    // Unsubscribe a user from the room
    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(
      @MessageBody('userId') userId: number,
      @ConnectedSocket() client: Socket,
    ) {
      client.leave(`user-${userId}`);
      this.logger.log(`User ${userId} left room: user-${userId}`);
    }
  
    // Broadcast new notifications to a specific user room
    async sendNotification(notification: CreateNotificationDto) {
      this.server.to(`user-${notification.userId}`).emit('newNotification', notification);
    }
  }