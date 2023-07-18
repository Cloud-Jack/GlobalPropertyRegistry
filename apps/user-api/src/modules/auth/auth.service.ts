import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ethers } from 'ethers';
import { RedisService } from 'libs/modules/cache/service';
import { SecretsService } from 'libs/modules/global/secrets/service';
import { ApiException } from 'libs/utils';
import { Repository } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { CreateUserDTO, UserUpdateTokensDTO } from '../user/dto/index';
import { UserEntity, UserJwtPayload, UserTokensInterface, UserUpdateTokensInterface } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly secretsService: SecretsService,
    private readonly redisService: RedisService,
  ) {}

  async login(user: UserEntity): Promise<UserTokensInterface> {
    const userJwtPayload: UserJwtPayload = { id: user.id, walletAddress: user.walletAddress.toLowerCase() };

    const accessToken = this.jwtService.sign(userJwtPayload);
    const refreshToken = this.jwtService.sign(userJwtPayload, {
      expiresIn: this.secretsService.authAPI.jwtRefreshExpiresIn,
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.userService.setHashedRefreshToken(user.id, hashedRefreshToken);
    await this.deletePhraseInStore(user.walletAddress);

    return {
      user: this.userService.getUserProfileData(user),
      accessToken,
      refreshToken: hashedRefreshToken,
    };
  }

  async register(payload: CreateUserDTO): Promise<UserTokensInterface> {
    const user = await this.userService.create(payload);
    await this.users.save(user);

    const userJwtPayload: UserJwtPayload = { id: user.id, walletAddress: user.walletAddress };

    const accessToken = this.jwtService.sign(userJwtPayload);
    const refreshToken = this.jwtService.sign(userJwtPayload, {
      expiresIn: this.secretsService.authAPI.jwtRefreshExpiresIn,
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.setHashedRefreshToken(user.id, hashedRefreshToken);

    return {
      user: this.userService.getUserProfileData(user),
      accessToken,
      refreshToken: hashedRefreshToken,
    };
  }

  async logout(userId: number) {
    await this.userService.setHashedRefreshToken(userId, '');
    return { accessToken: undefined, refreshToken: undefined };
  }

  async updateTokens({ userId, walletAddress, refreshToken }: UserUpdateTokensDTO): Promise<UserUpdateTokensInterface> {
    const user = await this.userService.getWithRefreshToken(userId, walletAddress, refreshToken);
    if (user === undefined) {
      throw new ApiException('user expired refresh', HttpStatus.UNAUTHORIZED);
    }

    const accessToken = this.jwtService.sign({ id: userId, walletAddress });
    const newRefreshToken = this.jwtService.sign(
      { id: userId, walletAddress },
      {
        expiresIn: this.secretsService.authAPI.jwtRefreshExpiresIn,
      },
    );
    const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await this.userService.setHashedRefreshToken(userId, hashedNewRefreshToken);

    return {
      userId,
      accessToken,
      refreshToken: hashedNewRefreshToken,
    };
  }

  async validateUser(_walletAddress: string, signature: string): Promise<UserEntity | undefined> {
    const walletAddress = _walletAddress.toLowerCase();
    const user = await this.userService.getBy({ walletAddress });

    const { phrase, walletAddress: address } = await this.getPhraseFromStore(walletAddress);
    const verifiedAddress = ethers.verifyMessage(phrase, signature).toLowerCase();

    if (user && verifiedAddress === address) {
      return user;
    }
    return undefined;
  }

  async getLoginPhrase(_walletAddress: string): Promise<string> {
    const walletAddress = _walletAddress.toLowerCase();
    if (!ethers.isAddress(walletAddress))
      throw new ApiException('invalid walletAddress', HttpStatus.PRECONDITION_FAILED);

    const user = await this.userService.getBy({ walletAddress });
    if (!user) throw new ApiException('unknown walletAddress', HttpStatus.PRECONDITION_FAILED);

    const { phrase } = await this.getPhraseFromStore(walletAddress);
    if (phrase) throw new ApiException('phrase has been already sent', HttpStatus.TOO_MANY_REQUESTS);

    const newPhrase = uuidV4();
    await this.setPhraseInStore(walletAddress, newPhrase);
    return newPhrase;
  }

  private getPhraseStoreKey(walletAddress: string) {
    const address = walletAddress.toLowerCase();
    const prefix = this.redisService.prefixes['get:auth:phrase'];
    return `${prefix}${address}`;
  }

  private async setPhraseInStore(walletAddress: string, phrase: string) {
    const key = this.getPhraseStoreKey(walletAddress);
    await this.redisService.set(key, phrase, { EX: this.secretsService.authAPI.phraseTTL });
  }

  private async deletePhraseInStore(walletAddress: string) {
    const key = this.getPhraseStoreKey(walletAddress);
    await this.redisService.del(key);
  }

  private async getPhraseFromStore(walletAddress: string) {
    const key = this.getPhraseStoreKey(walletAddress);
    const phrase = await this.redisService.get(key);
    if (!phrase) {
      return { phrase: undefined, key, walletAddress };
    } else {
      if (typeof phrase !== 'string')
        throw new ApiException(
          `cache service: phrase for ${walletAddress} is not a string`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      return { phrase, key, walletAddress };
    }
  }
}
