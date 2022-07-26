import { ApiProperty } from '@nestjs/swagger';

export class MailPostDto {
  @ApiProperty()
  mail: number;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  mailText: string;
}
