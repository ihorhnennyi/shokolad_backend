import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Игорь', description: 'Имя пользователя' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strong_password', description: 'Пароль пользователя', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: UserRole.MANAGER,
    enum: UserRole,
    required: false,
    description: 'Роль пользователя',
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
