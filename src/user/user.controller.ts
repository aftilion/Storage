import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Redirect,
  Render,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InviteLinkCreate } from './DTO/invite.create.model';
import { UserInfo } from './user.decorator';
import { AuthGuard } from './models/auth.guard';
import { PasswordChangeDto } from './DTO/password.change.dto';
import { EmailChangeDto } from './DTO/email.change.dto';
import { User } from './DTO/user';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './DTO/edit.user.dto';

@Controller('/user')
@ApiTags('user')
export class UserController {
  constructor(
    private userService: UserService,
    private prismaService: PrismaService,
  ) {}
  @Get('/settings')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard)
  settings(@Res() res, @UserInfo() user): void {
    res.render('user/settings', { user });
  }

  @Post('/email')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard)
  @Redirect('/user/settings')
  async ChangeEmail(
    @Res() res,
    @UserInfo() user,
    @Body() mails: EmailChangeDto,
  ): Promise<void> {
    await this.userService.changeEmail(mails);
  }

  @Post('/password')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard)
  @Redirect('/user/settings')
  async ChangePassword(
    @Res() res,
    @UserInfo() user,
    @Body() pass: PasswordChangeDto,
  ): Promise<void> {
    await this.userService.changePassword(user, pass);
  }

  @Get('/userlist')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard)
  @Render('user/userlist')
  async userlist(
    @Res() res,
    @UserInfo() user: User,
  ): Promise<{ user: User; inviteLinks: any; users: any }> {
    return {
      inviteLinks: await this.prismaService.inviteLink.findMany(),
      users: await this.prismaService.user.findMany(),
      user,
    };
  }

  @ApiOperation({ summary: 'Add invite link to database' })
  @ApiResponse({ status: 200, description: 'Add' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Invalid field at invite link.' })
  @ApiBearerAuth()
  @Post('/invitelink')
  @Redirect('/user/userlist')
  @UseGuards(AuthGuard)
  async addInviteLinkPost(@Res() res, @Body() params: InviteLinkCreate) {
    await this.userService.addLink(params.name, this.prismaService);
  }

  @ApiOperation({ summary: 'remove invite link from database' })
  @ApiParam({ name: 'link' })
  @ApiResponse({ status: 200, description: 'Add' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Invalid field at invite link.' })
  @Delete('/invitelink/:link')
  @UseGuards(AuthGuard)
  async deleteInviteLink(@Param('link') link: string) {
    await this.userService.deleteLink(link, this.prismaService);
  }

  @ApiOperation({ summary: 'edit user' })
  @ApiParam({ name: 'uid', type: 'string' })
  @ApiResponse({ status: 200, description: 'edit' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Invalid field at user.' })
  @Put('/:uid?')
  @UseGuards(AuthGuard)
  async editUser(
    @Param('uid') id: string,
    @Query() user: EditUserDto,
    @Res() res,
  ) {
    const error = await this.userService.editUser(id, user, this.prismaService);
    if (error) return res.status(400).send(error);
    else return res.send('done');
  }

  @ApiOperation({ summary: 'remove user' })
  @ApiParam({ name: 'uid', type: 'string' })
  @ApiResponse({ status: 200, description: 'remove' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Invalid field at user.' })
  @Delete('/:uid')
  @UseGuards(AuthGuard)
  async removeUser(@Param('uid') id: string) {
    await this.userService.removeUser(id, this.prismaService);
  }
}
