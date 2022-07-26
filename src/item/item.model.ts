import { ApiProperty } from '@nestjs/swagger';

export class Item {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  worksUntil: Date;

  @ApiProperty()
  place: string;
}
