import { ApiProperty } from '@nestjs/swagger';

export class InviteLinkCreate {
  @ApiProperty()
  name: string;

  @ApiProperty()
  Roles: any;
}
