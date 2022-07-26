import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from './notification.service';
import { getAuth } from 'firebase/auth';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class NotificationGateway implements OnGatewayInit {
  constructor(
    private notificationService: NotificationService,
    private prismaService: PrismaService,
  ) {}

  @WebSocketServer() server: Server;

  afterInit(server: any) {
    this.server = server;
  }

  @SubscribeMessage('setUser')
  async setUser(client: Socket) {
    client.join(getAuth().currentUser.uid);
    return 'done';
  }

  @SubscribeMessage('getAllNotifications')
  async getAllNotification(client: any, uid: string) {
    return await this.prismaService.notification.findMany({
      where: {
        uid: {
          uid: uid,
        },
      },
      select: {
        name: true,
        description: true,
        status: true,
      },
    });
  }

  @SubscribeMessage('getNotification')
  async getNotification(
    client: any,
    message: {
      user: string;
      name: string;
      description: string;
      status: number;
    },
  ): Promise<any> {
    const mess = {
      name: message.name,
      description: message.description,
      status: message.status,
    };
    this.server.to(message.user).emit('getNotification', mess);
  }

  async addNotification(message: {
    user: string;
    name: string;
    description: string;
    status: number;
  }) {
    await this.prismaService.notification.create({
      data: {
        name: message.name,
        description: message.description,
        status: Number(message.status),
        uid: {
          connect: {
            uid: message.user,
          },
        },
      },
    });
    await this.getNotification(null, message);
  }
}
