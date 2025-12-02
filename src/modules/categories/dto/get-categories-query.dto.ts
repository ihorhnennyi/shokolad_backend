import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBooleanString, IsInt, IsMongoId, IsOptional, IsString, Min } from 'class-validator';

export class GetCategoriesQueryDto {
  @ApiPropertyOptional({ description: 'Пошук по назві' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'ID батьківської категорії' })
  @IsOptional()
  @IsMongoId()
  parentId?: string;

  @ApiPropertyOptional({ description: 'Тільки активні' })
  @IsOptional()
  @IsBooleanString()
  isActive?: string;

  @ApiPropertyOptional({ description: 'Сторінка', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Кількість на сторінку', default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 50;
}
