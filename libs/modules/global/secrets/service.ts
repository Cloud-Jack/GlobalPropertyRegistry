import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LevelWithSilent } from 'pino';

import { ISecretsService } from './adapter';
import { AuthAPIEnvironment, BlockchainAPIEnvironment, PropertyAPIEnvironment } from './enum';

@Injectable()
export class SecretsService extends ConfigService implements ISecretsService {
  constructor() {
    super();
  }

  ELK_URL = this.get('ELK_URL');

  MONGO_EXPRESS_URL = this.get('MONGO_EXPRESS_URL');
  REDIS_COMMANDER_URL = this.get('REDIS_COMMANDER_URL');
  JEAGER_URL = this.get('JEAGER_URL');
  KIBANA_URL = this.get('KIBANA_URL');

  REDIS_URL = this.get('REDIS_URL');

  ENV = this.get<string>('ENV');

  LOG_LEVEL = this.get<LevelWithSilent>('LOG_LEVEL');

  database_mongo = {
    host: this.get('MONGO_HOST'),
    port: this.get<number>('MONGO_PORT'),
    user: this.get('MONGO_INITDB_ROOT_USERNAME'),
    pass: this.get('MONGO_INITDB_ROOT_PASSWORD'),
    dbMain: this.get('MONGO_DB_MAIN'),
  };

  database_postgres = {
    host: this.get('POSTGRES_HOST'),
    port: this.get<number>('POSTGRES_PORT'),
    user: this.get('POSTGRES_USER'),
    pass: this.get('POSTGRES_PASSWORD'),
    db: this.get('POSTGRES_DB'),
  };

  propertyAPI = {
    port: this.get<number>(PropertyAPIEnvironment.PORT),
    url: this.get(PropertyAPIEnvironment.URL),
  };

  blockchainAPI = {
    port: this.get<number>(BlockchainAPIEnvironment.PORT),
    url: this.get(BlockchainAPIEnvironment.URL),
  };

  authAPI = {
    port: this.get<number>(AuthAPIEnvironment.PORT),
    jwtToken: this.get(AuthAPIEnvironment.SECRET_JWT),
    jwtExpiresIn: this.get(AuthAPIEnvironment.JWT_EXPIRES_IN),
    jwtRefreshExpiresIn: this.get(AuthAPIEnvironment.JWT_REFRESH_EXPIRES_IN),
    url: this.get(AuthAPIEnvironment.URL),
    phraseTTL: this.get<number>('AUTH_PHRASE_TTL', 300),
  };
}
