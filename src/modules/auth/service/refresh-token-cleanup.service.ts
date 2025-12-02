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
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const expiredResult = await this.tokenModel.deleteMany({
      expiresAt: { $lte: now },
    });

    const revokedResult = await this.tokenModel.deleteMany({
      revoked: true,
      updatedAt: { $lte: sevenDaysAgo },
    });

    const deletedExpired = expiredResult.deletedCount ?? 0;
    const deletedRevoked = revokedResult.deletedCount ?? 0;

    if (deletedExpired || deletedRevoked) {
      this.logger.log(
        `🧹 Refresh tokens cleanup: expired=${deletedExpired}, revoked=${deletedRevoked}`,
      );
    }
  }
}
