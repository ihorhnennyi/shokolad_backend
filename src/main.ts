import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { setupSwagger } from '@config/swagger/swagger.config';
import { AppModule } from '@modules/app/app.module';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  setupSwagger(app);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') ?? 3000;

  await app.listen(port);
}

bootstrap();
