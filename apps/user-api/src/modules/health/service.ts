import { Injectable } from '@nestjs/common';
import { name, version } from 'apps/user-api/package.json';
import { LoggerService } from 'libs/modules/global/logger/service';

import { IHealthService } from './adapter';

@Injectable()
export class HealthService implements IHealthService {
  constructor(private readonly loggerService: LoggerService) {}

  async getText(): Promise<string> {
    const appName = `${name}-${version} UP!!`;
    this.loggerService.info({ message: appName, context: `HealthService/getText` });
    return appName;
  }
}
