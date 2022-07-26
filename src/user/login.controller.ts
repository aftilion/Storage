import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { UserLoginDto } from './models/user.login.model';
import {
  ApiBasicAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginService } from './login.service';
import { Link, LinkInfo } from './models/link.model';
import { UserCreate } from './DTO/user.create.model';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
@ApiTags('login')
export class LoginController {
  constructor(
    private loginService: LoginService,
    private prismaService: PrismaService,
  ) {}

  @ApiExcludeEndpoint()
  @Get('/login')
  login(@Res() res): void {
    res.render('user/login');
  }

  @ApiOperation({
    summary: 'Login to the app',
  })
  @ApiResponse({
    status: 200,
    description: 'Login to the app.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @Post('/login')
  async loginPost(
    @Body() ResUser: UserLoginDto,
    @Res({ passthrough: true }) res,
  ): Promise<void> {
    await this.loginService.loginPost(ResUser, res);
  }

  @ApiOperation({
    summary: 'Logout from the app',
  })
  @Get('/logout')
  async logout(@Res() res) {
    await this.loginService.logout(res);
  }

  @Get('/invite/:link')
  @ApiExcludeEndpoint()
  async invite(
    @Param('link') link: string,
    @Res() res,
    @LinkInfo() linkInfo: Link,
  ) {
    if (linkInfo == null) res.redirect('/login');
    else
      res.render('user/invite', {
        link: linkInfo,
      });
  }

  @ApiOperation({ summary: 'Create user from invite link' })
  @ApiResponse({ status: 200, description: 'Create' })
  @ApiResponse({ status: 404, description: 'Bad invite link' })
  @ApiResponse({ status: 400, description: 'Error in user field' })
  @Post('/invite/:link')
  @ApiParam({ name: 'link', type: 'string' })
  async createUser(
    @Param('link') link: string,
    @Res() res,
    @Body() params: UserCreate,
    @LinkInfo() linkInfo: Link,
  ) {
    console.log(linkInfo);
    if (linkInfo == null) res.redirect('/login');
    await this.loginService.invite(
      link,
      params,
      linkInfo,
      this.prismaService,
      res,
    );
  }
}
