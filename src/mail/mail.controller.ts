import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MailPostDto } from './models/mail.post.model';
import { UserInfo } from '../user/user.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../user/models/auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { MailsService } from './mail.service';
import { NotificationGateway } from '../notification/notification.gateway';

@UseGuards(AuthGuard)
@Controller('/mail')
@ApiTags('mail')
export class MailController {
  constructor(
    private prismaService: PrismaService,
    private mailService: MailsService,
    private notificationGateway: NotificationGateway,
  ) {}

  @Get('/')
  @ApiExcludeEndpoint()
  @Render('mail/index')
  async mail(@Res() res, @UserInfo() user): Promise<any> {
    return {
      mails: await this.prismaService.mail.findMany(),
      user,
    };
  }

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Send emails' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        mail: { type: 'integer' },
        subject: { type: 'string' },
        mailText: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Render('mail/index')
  async mailPost(
    @Body() mailParams: MailPostDto,
    @UploadedFile('file') file,
    @Res() res,
  ): Promise<any> {
    await this.mailService.mailPost(
      mailParams,
      file,
      this.prismaService,
      this.notificationGateway,
    );
    return {
      mails: await this.prismaService.mail.findMany(),
    };
  }

  @ApiOperation({ summary: 'Send emails' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get('check')
  @Redirect('/')
  async checkNotification(@UserInfo() user) {
    await this.notificationGateway.addNotification({
      user: user.uid,
      name: 'Successes checked',
      description: 'success',
      status: 1,
    });
  }
}
