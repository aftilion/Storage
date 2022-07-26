import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { ItemModule } from '../item/item.module';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    UserModule,
    MailModule,
    ItemModule,
    PrismaModule,
    NotificationModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
