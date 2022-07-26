import { CanActivate, Injectable } from '@nestjs/common';
import { User } from '../DTO/user';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(): Promise<boolean> {
    return (await User.initialize()).isValid;
  }
}
