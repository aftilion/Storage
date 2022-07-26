import { ApiProperty } from '@nestjs/swagger';

export class EmailChangeDto {

  @ApiProperty()
  newEmail: any;

  @ApiProperty()
  reNewEmail: any;
}
