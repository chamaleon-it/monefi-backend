import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import configuration from './config/configuration';
import origin from './config/origin';
import { validationPipelineConfig } from './config/validationPipeline.config';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

  app.enableCors({
    origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });
  app.useGlobalPipes(new ValidationPipe(validationPipelineConfig));
  await app.listen(configuration().port ?? 3001);
}
bootstrap();
