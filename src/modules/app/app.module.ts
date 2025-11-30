import { appConfig } from '@config/app/app.config';
import { databaseConfig } from '@config/database/database.config';
import { envValidationSchema } from '@config/env/env.validation';
import { HealthModule } from '@modules/health/health.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      validationSchema: envValidationSchema,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('database.uri');
        const dbName = configService.get<string>('database.name');

        return {
          uri,
          dbName,
        };
      },
    }),
    HealthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
