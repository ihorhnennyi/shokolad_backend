import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';
import { NewsBlockDto } from './news-block.dto';

export class CreateNewsDto {
  @ApiProperty({ example: 'ІЧМ отримав категорію А' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    example: 'Короткий опис новини для превʼю на головній сторінці.',
  })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiPropertyOptional({
    type: [NewsBlockDto],
    description: 'Массив блоков контента (текст, изображения, списки и т.п.)',
  })
  @IsOptional()
  @IsArray()
  @Type(() => NewsBlockDto)
  blocks?: NewsBlockDto[];
}
