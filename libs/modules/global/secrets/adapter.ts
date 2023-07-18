import { AuthAPIEnvironment, BlockchainAPIEnvironment, PropertyAPIEnvironment } from './enum';

export abstract class ISecretsService {
  ENV: string;
  REDIS_URL: string;

  ELK_URL: string;

  MONGO_EXPRESS_URL: string;
  JEAGER_URL: string;
  REDIS_COMMANDER_URL: string;
  KIBANA_URL: string;

  LOG_LEVEL: string;

  database_mongo: {
    host: string;
    port: number;
    user: string;
    pass: string;
    dbMain: string;
  };

  database_postgres: {
    host: string;
    port: number;
    user: string;
    pass: string;
    db: string;
  };

  propertyAPI: {
    port: PropertyAPIEnvironment | number;
    url: PropertyAPIEnvironment | string;
  };

  blockchainAPI: {
    port: BlockchainAPIEnvironment.PORT | number;
    url: BlockchainAPIEnvironment.URL | string;
  };

  authAPI: {
    port: AuthAPIEnvironment | number;
    jwtToken: AuthAPIEnvironment | string;
    jwtExpiresIn: AuthAPIEnvironment | string;
    jwtRefreshExpiresIn: AuthAPIEnvironment | string;
    url: AuthAPIEnvironment | string;
  };
}
