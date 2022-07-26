import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailsService } from './mail.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  controllers: [MailController],
  providers: [MailsService],
})
export class MailModule {}
