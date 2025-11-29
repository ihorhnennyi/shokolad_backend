import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { AppModule } from '@modules/app/app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}

bootstrap();
