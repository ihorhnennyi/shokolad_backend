import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../enums/user-role.enum';
import { UsersService } from '../users.service';

@Injectable()
export class UsersSeedService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const email = this.configService.get<string>('ADMIN_EMAIL');
    const password = this.configService.get<string>('ADMIN_PASSWORD');
    const name = this.configService.get<string>('ADMIN_NAME') ?? 'Admin';

    if (!email || !password) {
      return;
    }

    const existing = await this.usersService.findByEmail(email);

    if (existing) {
      return;
    }

    await this.usersService.create({
      name,
      email,
      password,
      role: UserRole.ADMIN,
    });
  }
}
