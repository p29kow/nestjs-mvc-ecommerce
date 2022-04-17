import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as methodOverride from 'method-override';
import * as passport from 'passport';
import * as session from 'express-session';
import flash = require('connect-flash');

import { GeneralExceptionsFilter } from './common/filters/general-exceptions.filter';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.useStaticAssets(join(__dirname, '..', '../public'));
  app.setBaseViewsDir(join(__dirname, '..', '../views'));
  app.setViewEngine('ejs');
  
  app.use(methodOverride('_method'));
  app.use(
    session({
      secret: configService.get('SECRET'),
      resave: false,
      saveUninitialized: false
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  app.useGlobalFilters(new GeneralExceptionsFilter());


  await app.listen(3000);
}
bootstrap();
