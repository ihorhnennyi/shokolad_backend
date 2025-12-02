import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponseDto } from './category-response.dto';

export class PaginatedCategoriesResponseDto {
  @ApiProperty({ type: [CategoryResponseDto] })
  items: CategoryResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}
