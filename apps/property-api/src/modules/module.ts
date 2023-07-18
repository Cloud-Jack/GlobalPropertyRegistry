import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'apps/user-api/src/modules/auth/auth.module';
// import { HealthModule } from './health/module';
import { UserModule } from 'apps/user-api/src/modules/user/user.module';
import { RedisModule } from 'libs/modules/cache/module';
import { MongooseMainDBModule } from 'libs/modules/database/connection/main';
import { SnapshotModule } from 'libs/modules/database/mongo/repository-modules/snapshot/snapshot.module';
import { TypeOrmPostgresService } from 'libs/modules/database/typeorm.service';
import { LoggerModule } from 'libs/modules/global/logger/module';
import { GlobalModule } from 'libs/modules/global/module';
import { SecretsModule } from 'libs/modules/global/secrets/module';
import { SecretsService } from 'libs/modules/global/secrets/service';

@Module({
  imports: [
    // HealthModule,
    GlobalModule,
    UserModule,
    LoggerModule,
    SecretsModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmPostgresService,
      extraProviders: [SecretsService],
    }),
    MongooseMainDBModule,
    RedisModule,
    AuthModule,
    SnapshotModule,
  ],
  providers: [],
})
export class MainModule {}
