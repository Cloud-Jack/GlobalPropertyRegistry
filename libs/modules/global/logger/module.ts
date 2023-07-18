import { Module } from '@nestjs/common';

import { SecretsService } from '../secrets/service';
// import { ILoggerService } from './adapter';
import { LoggerService } from './service';

@Module({
  providers: [
    {
      provide: LoggerService,
      useFactory: ({ LOG_LEVEL, ELK_URL }: SecretsService) => {
        const logger = new LoggerService(ELK_URL);
        logger.connect(LOG_LEVEL);
        return logger;
      },
      inject: [SecretsService],
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
