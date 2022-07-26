import { ApiProperty } from '@nestjs/swagger';

export class PasswordChangeDto {
  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  newPassword: any;

  @ApiProperty()
  reNewPassword: any;
}
