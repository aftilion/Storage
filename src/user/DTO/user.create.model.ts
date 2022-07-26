import { ApiProperty } from '@nestjs/swagger';

export class UserCreate {
  @ApiProperty()
  login: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  re_password: string;

}
