import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { addDays } from 'date-fns';
import { Model } from 'mongoose';
import { RefreshToken, RefreshTokenDocument } from '../schemas/refresh-token.schema';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly tokenModel: Model<RefreshTokenDocument>,
  ) {}

  async create(userId: string, token: string, expiresInDays = 7) {
    return this.tokenModel.create({
      userId,
      token,
      expiresAt: addDays(new Date(), expiresInDays),
    });
  }

  async find(token: string) {
    return this.tokenModel.findOne({ token }).exec();
  }

  async revoke(token: string) {
    return this.tokenModel.updateOne({ token }, { revoked: true }).exec();
  }

  async revokeAllForUser(userId: string) {
    return this.tokenModel.updateMany({ userId }, { revoked: true }).exec();
  }
}
