// call.gateway.ts
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

@WebSocketGateway({ cors: true })
export class CallGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private users = new Map<string, string>(); // phone -> socketId

  private getSocketIdOrThrow(phone: string): string {
    const socketId = this.users.get(phone);
    if (!socketId) {
      throw new Error(`User with phone ${phone} is not connected.`);
    }
    return socketId;
  }

  handleConnection(socket: Socket) {
    console.log('User connected', socket.id);
  }

  handleDisconnect(socket: Socket) {
    const phone = [...this.users.entries()].find(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, id]) => id === socket.id,
    )?.[0];
    if (phone) this.users.delete(phone);
    this.server.emit('user:disconnect', { phone });
  }

  @SubscribeMessage('user:connect')
  handleUserConnect(
    @MessageBody() data: { phone: string },
    @ConnectedSocket() socket: Socket,
  ) {
    this.users.set(data.phone, socket.id);
    socket.emit('user:list', Array.from(this.users.keys()));
  }

  @SubscribeMessage('call:initiate')
  handleCallInitiate(@MessageBody() data: { from: string; to: string }) {
    const targetSocketId = this.users.get(data.to);
    if (targetSocketId) {
      this.server.to(targetSocketId).emit('call:incoming', {
        from: data.from,
      });
    }
  }

  @SubscribeMessage('call:accept')
  handleCallAccept(@MessageBody() data: { to: string }) {
    this.server
      .to(this.getSocketIdOrThrow(data.to))
      .emit('call:accepted', data);
  }

  @SubscribeMessage('call:reject')
  handleCallReject(@MessageBody() data: { to: string }) {
    this.server
      .to(this.getSocketIdOrThrow(data.to))
      .emit('call:rejected', data);
  }

  @SubscribeMessage('signal')
  handleSignal(
    @MessageBody()
    data: {
      to: string;
      type: string;
      payload: any;
      from: string;
    },
  ) {
    this.server.to(this.getSocketIdOrThrow(data.to)).emit('signal', {
      type: data.type,
      from: data.from,
    });
  }
}
