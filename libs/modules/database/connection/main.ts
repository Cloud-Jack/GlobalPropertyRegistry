import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SecretsModule } from '../../global/secrets/module';
import { SecretsService } from '../../global/secrets/service';
import { IDataBaseService, IRepository } from '../adapter';
import { ConnectionName } from '../enum';
import { Repository } from '../repository';
import { DataBaseService } from '../service';

@Module({
  providers: [
    {
      provide: IDataBaseService,
      useClass: DataBaseService,
    },
    {
      provide: IRepository,
      useClass: Repository,
    },
  ],
  imports: [
    SecretsModule,
    MongooseModule.forRootAsync({
      connectionName: ConnectionName.MAIN,
      useFactory: ({ database_mongo: { host, port, pass, user, dbMain } }: SecretsService) =>
        new DataBaseService().getDefaultConnection({ dbName: dbMain, host, pass, port, user }),
      inject: [SecretsService],
    }),
  ],
})
export class MongooseMainDBModule {}
