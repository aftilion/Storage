import { createParamDecorator, Injectable } from '@nestjs/common';
import { User } from './DTO/user';

export const UserInfo = createParamDecorator(async () => {
  return await User.initialize();
});
