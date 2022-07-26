import { PrismaClient } from '@prisma/client';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export class Link {
  public link: string;
  public name: string;


  public static async initialize(link: string) {
    const prisma = new PrismaClient();
    const linkObj = await prisma.inviteLink.findUnique({
      where: {
        link: link,
      },
    });
    return new Link(linkObj.link, linkObj.name);
  }

  private constructor(link, name) {
    this.link = link;
    this.name = name;
  }
}

export const LinkInfo = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const link = ctx.switchToHttp().getRequest().params.link;
    return await Link.initialize(link);
  },
);
