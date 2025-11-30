import { appConfig } from '@config/app/app.config';
import { authConfig } from '@config/auth/auth.config';
import { databaseConfig } from '@config/database/database.config';
import { envValidationSchema } from '@config/env/env.validation';
import { AuthModule } from '@modules/auth/auth.module';
import { HealthModule } from '@modules/health/health.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig],
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
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
