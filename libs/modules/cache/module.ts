import { Module } from '@nestjs/common';

import { LoggerService } from '../global/logger/service';
import { SecretsService } from '../global/secrets/service';
import { RedisService } from './service';

@Module({
  providers: [
    {
      provide: RedisService,
      useFactory: async ({ REDIS_URL }: SecretsService, logger: LoggerService) => {
        const cacheService = new RedisService({ url: REDIS_URL }, logger);
        await cacheService.connect();
        return cacheService;
      },
      inject: [SecretsService, LoggerService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
