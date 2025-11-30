import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Connection } from 'mongoose';

@Controller('health')
@ApiTags('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  @ApiOperation({ summary: 'Health check API и MongoDB' })
  getHealth() {
    const dbState = this.connection.readyState === 1 ? 'up' : 'down';

    return {
      status: 'ok',
      db: dbState,
      timestamp: new Date().toISOString(),
    };
  }
}
