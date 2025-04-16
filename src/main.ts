import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import {
  Internal,
  jwt,
  jwt_retail,
  redisconfig,
  serviceport,
  vaultConfig,
} from '@const';
import * as vault from 'node-vault';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  // get Vault
  const vaultServer = vault(vaultConfig);
  const v = await vaultServer.read('kv/data/jwt');
  jwt.secret = v.data.data.access_secret;
  Internal.secret = v.data.data.internal_secret;
  const v_retail = await vaultServer.read('kv/data/jwt_retail');
  jwt_retail.secret = v_retail.data.data.access_secret;
  const v2 = await vaultServer.read('kv/data/redis');
  redisconfig.password = v2.data.data.password;

  const app = await NestFactory.create(AppModule);
  app.use('/pdf', express.static(join(process.cwd(), 'public', 'pdf')));
  // Set up validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Document Conversion API')
    .setDescription('API for converting DOCX files to HTML and PDF')
    .setVersion('1.0')
    .addTag('Convert')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(serviceport);
}
bootstrap();
