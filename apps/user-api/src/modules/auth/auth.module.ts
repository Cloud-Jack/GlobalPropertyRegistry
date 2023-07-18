import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'libs/modules/cache/module';
import { LoggerModule } from 'libs/modules/global/logger/module';
import { GlobalModule } from 'libs/modules/global/module';
import { SecretsModule } from 'libs/modules/global/secrets/module';
import { SecretsService } from 'libs/modules/global/secrets/service';

import { UserEntity } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    GlobalModule,
    UserModule,
    SecretsModule,
    LoggerModule,
    RedisModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      useFactory: async (secrets: SecretsService) => ({
        secret: secrets.authAPI.jwtToken,
        signOptions: { expiresIn: secrets.authAPI.jwtExpiresIn },
      }),
      inject: [SecretsService],
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, SecretsService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
