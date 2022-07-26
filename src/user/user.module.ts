import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { UserController } from './user.controller';
import { LoginService } from './login.service';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LoginController, UserController],
  providers: [LoginService, UserService],
})
export class UserModule {}
