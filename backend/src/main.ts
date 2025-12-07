import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import * as cookieParser from 'cookie-parser';
import { helmetConfig } from './config/helmet.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.use(json({ limit: '20mb' }));
  app.use(urlencoded({ extended: true }));
  app.use(helmetConfig);
  app.use(cookieParser());

  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN') || '',
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');
  const nodeEnv = configService.get<string>('NODE_ENV') || 'development';

  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);
  console.log(`Server running on port ${port} in ${nodeEnv} mode`);
}
void bootstrap();
