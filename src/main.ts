import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './app/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { initializeApp } from 'firebase/app';

async function bootstrap() {
  const env = new ConfigService();
  const firebaseConfig = {
    apiKey: env.get('FIREBASE_API_KEY'),
    authDomain: env.get('FIREBASE_AUTH_DOMAIN'),
    projectId: env.get('FIREBASE_PROJECT_ID'),
    storageBucket: env.get('FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: env.get('FIREBASE_MESSAGING'),
    appId: env.get('FIREBASE_APPID'),
    measurementId: env.get('FIREBASE_MEASUREMENTID'),
  };
  initializeApp(firebaseConfig);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 4000;
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  const config = new DocumentBuilder()
    .setTitle('EquipWar Swagger')
    .setDescription('api for equipWar')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port);
}

bootstrap();
