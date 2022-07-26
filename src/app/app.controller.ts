import {
  Controller,
  Get,
  Render,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoadingInterceptor } from './loading.interceptor';
import { UserInfo } from '../user/user.decorator';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { AuthGuard } from '../user/models/auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
@UseGuards(AuthGuard)
@UseInterceptors(LoadingInterceptor)
export class AppController {
  constructor(private prismaService: PrismaService) {}

  @Get()
  @Render('app/index')
  @ApiExcludeEndpoint()
  async index(@UserInfo() user): Promise<any> {
    return {
      items: await this.prismaService.item.findMany(),
      user,
    };
  }

  @Get('/404')
  @Render('app/404')
  @ApiExcludeEndpoint()
  notFound(@UserInfo() user): any {
    return {
      user,
    };
  }
}
