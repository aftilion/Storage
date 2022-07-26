import { ApiProperty } from '@nestjs/swagger';

export class EditUserDto {
  @ApiProperty()
  name: string | null;
  @ApiProperty()
  isFrozen: boolean | null;
}
