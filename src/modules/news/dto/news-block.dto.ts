import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { NewsBlockType } from '../enums/news-block-type.enum';

export class NewsBlockDto {
  @ApiProperty({ enum: NewsBlockType, example: NewsBlockType.TEXT })
  @IsEnum(NewsBlockType)
  type: NewsBlockType;

  @ApiPropertyOptional({ description: 'Текстовое содержимое блока' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'URL изображения для блока IMAGE' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Список пунктов для блока LIST',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  items?: string[];
}
