import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { RefreshToken, RefreshTokenDocument } from '../schemas/refresh-token.schema';

@Injectable()
export class RefreshTokenCleanupService {
  private readonly logger = new Logger(RefreshTokenCleanupService.name);

  constructor(
    @InjectModel(RefreshToken.name)
    private readonly tokenModel: Model<RefreshTokenDocument>,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCleanup() {
    const now = new Date();

    const result = await this.tokenModel.deleteMany({
      expiresAt: { $lte: now },
    });

    if (result.deletedCount > 0) {
      this.logger.log(`🧹 Очистка refresh-токенов: удалено ${result.deletedCount}`);
    }
  }
}
