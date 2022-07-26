import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Render,
  Res,
} from '@nestjs/common';
import { UserInfo } from '../user/user.decorator';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Item } from './item.model';
import { PrismaService } from '../prisma/prisma.service';
import { ItemService } from './item.service';

@Controller('/item')
@ApiTags('item')
export class ItemController {
  constructor(
    private prismaService: PrismaService,
    private itemService: ItemService,
  ) {}

  @Get('/:id')
  @ApiExcludeEndpoint()
  @Render('item/index')
  getItem(@Param('id') id: number, @UserInfo() user) {
    return {
      username: user.usename,
    };
  }

  @ApiExcludeEndpoint()
  @Get('/add')
  @ApiExcludeEndpoint()
  @Render('item/edit')
  addItem(@UserInfo() user): any {
    const item: Item = new Item();
    return {
      user,
      item,
    };
  }

  @ApiOperation({ summary: 'Add item to database' })
  @ApiResponse({ status: 200, description: 'Add' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Error at item field' })
  @ApiBearerAuth()
  @Post()
  async addItemPost(
    @UserInfo() user,
    @Res() res,
    @Body() newItem: Item,
  ): Promise<void> {
    await this.itemService.addItem(newItem, res, this.prismaService);
  }

  @ApiOperation({ summary: 'Remove item from database' })
  @ApiResponse({ status: 200, description: 'Remove item' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Invalid id' })
  @ApiBearerAuth()
  @Delete('/:id')
  @ApiParam({ name: 'id', type: 'number' })
  async removeItem(
    @Param('id') id: number,
    @UserInfo() user,
    @Res() res,
  ): Promise<void> {
    await this.itemService.removeItem(id, res, this.prismaService);
  }

  @Get('/edit/:id')
  @ApiExcludeEndpoint()
  @ApiParam({ name: 'id', type: 'number' })
  async editItem(id: number, @UserInfo() user, @Res() res): Promise<void> {
    await this.itemService.getEditItem(id, res, user, this.prismaService);
  }

  @ApiOperation({ summary: 'Change item' })
  @ApiResponse({ status: 200, description: 'change' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Invalid id.' })
  @ApiResponse({ status: 400, description: 'Error at item field' })
  @ApiBearerAuth()
  @Put('/:id')
  @ApiParam({ name: 'id', type: 'number' })
  async editItemPost(
    id: number,
    @UserInfo() user,
    @Res() res,
    @Body() newItem: Item,
  ): Promise<void> {
    await this.itemService.postEditItem(id, newItem, res, this.prismaService);
  }
}
