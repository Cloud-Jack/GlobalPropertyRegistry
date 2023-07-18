import { HttpStatus, RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { description, name, version } from 'apps/property-api/package.json';
import { useContainer } from 'class-validator';
import { bold } from 'colorette';
import { LoggerService } from 'libs/modules/global/logger/service';
import { SecretsService } from 'libs/modules/global/secrets/service';
import { DEFAULT_TAG, SWAGGER_API_ROOT } from 'libs/utils/documentation/constants';
import { AppExceptionFilter } from 'libs/utils/filters/http-exception.filter';
import { ExceptionInterceptor } from 'libs/utils/interceptors/exception/http-exception.interceptor';
import { HttpLoggerInterceptor } from 'libs/utils/interceptors/logger/http-logger.interceptor';
import { TracingInterceptor } from 'libs/utils/interceptors/logger/http-tracing.interceptor';

import { BlockchainApiModule } from './blockchain.module';

async function bootstrap() {
  const app = await NestFactory.create(BlockchainApiModule, {
    bufferLogs: true,
    cors: true,
  });

  useContainer(app.select(BlockchainApiModule), { fallbackOnErrors: true });

  const loggerService = app.get(LoggerService);

  loggerService.setApplication(name);
  app.useGlobalFilters(new AppExceptionFilter(loggerService));

  app.useGlobalInterceptors(
    new ExceptionInterceptor(),
    new HttpLoggerInterceptor(loggerService),
    new TracingInterceptor({ app: name, version }, loggerService),
  );

  const {
    propertyAPI: { port: PORT, url },
    ENV,
    KIBANA_URL,
    JEAGER_URL,
    MONGO_EXPRESS_URL,
    REDIS_COMMANDER_URL,
  } = app.get(SecretsService);

  app.useLogger(loggerService);

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.PRECONDITION_FAILED,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .addTag(DEFAULT_TAG)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_API_ROOT, app, document);

  loggerService.log(`🟢 ${name} listening at ${bold(PORT)} on ${bold(ENV?.toUpperCase())} 🟢\n`);

  await app.listen(PORT);

  const openApiURL = `${url}/${SWAGGER_API_ROOT}`;

  loggerService.log(`🔵 swagger listening at ${bold(openApiURL)}`);
  loggerService.log(`🔵 mongo-express listening at ${bold(MONGO_EXPRESS_URL)}`);
  loggerService.log(`🔵 redis-commander listening at ${bold(REDIS_COMMANDER_URL)}`);
  loggerService.log(`🔵 kibana listening at ${bold(KIBANA_URL)}`);
  loggerService.log(`🔵 jeager listening at ${bold(JEAGER_URL)}`);
}
bootstrap();
