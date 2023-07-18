import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { UserEntity } from '../../user/entity/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'walletAddress', passwordField: 'signature' });
  }

  async validate(walletAddress: string, signature: string): Promise<UserEntity | UnauthorizedException> {
    const user = await this.authService.validateUser(walletAddress, signature);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
