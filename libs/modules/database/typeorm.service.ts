import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { SecretsService } from '../global/secrets/service';

@Injectable()
export class TypeOrmPostgresService implements TypeOrmOptionsFactory {
  constructor(private readonly secretsService: SecretsService) {}
  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const {
      ENV,
      database_postgres: { host, port, pass, user, db },
    } = this.secretsService;
    return {
      type: 'postgres',
      host: host,
      port: port,
      username: user,
      password: pass,
      database: db,
      migrations: ['dist/migrations/*.js'],
      migrationsRun: true,
      autoLoadEntities: true,
      synchronize: ENV !== 'prod',
    };
  }
}

@Injectable()
export class TypeOrmMongoService implements TypeOrmOptionsFactory {
  constructor(private readonly secretsService: SecretsService) {}
  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const {
      database_mongo: { host, port, pass, user, dbMain },
    } = this.secretsService;
    return {
      type: 'mongodb',
      url: `mongodb://${user}:${pass}@${host}:${port}/${dbMain}?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-256`,
      autoLoadEntities: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    };
  }
}
