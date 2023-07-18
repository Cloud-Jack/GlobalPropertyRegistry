import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { SecretsService } from 'libs/modules/global/secrets/service';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserJwtPayload } from '../../user/entity/user.entity';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService, private readonly secrets: SecretsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secrets.authAPI.jwtToken,
    });
  }

  async validate(payload: UserJwtPayload): Promise<UserJwtPayload> {
    const { id, walletAddress } = payload;
    const user = await this.userService.getBy({ id, walletAddress });
    if (!user) throw new UnauthorizedException();
    return { ...payload, ...user };
  }
}
