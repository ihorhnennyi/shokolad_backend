import { Roles } from '@common/decorators/roles.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../users/enums/user-role.enum';
import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesQueryDto } from './dto/get-categories-query.dto';
import { PaginatedCategoriesResponseDto } from './dto/paginated-categories-response.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Створити категорію (тільки адмін)' })
  @ApiResponse({ status: 201, type: CategoryResponseDto })
  @Post()
  create(@Body() dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.categoriesService.create(dto);
  }

  @ApiOperation({ summary: 'Отримати список категорій (публічно)' })
  @ApiResponse({ status: 200, type: PaginatedCategoriesResponseDto })
  @Get()
  findAll(@Query() query: GetCategoriesQueryDto): Promise<PaginatedCategoriesResponseDto> {
    return this.categoriesService.findAll(query);
  }

  @ApiOperation({ summary: 'Отримати категорію за ID (публічно)' })
  @ApiResponse({ status: 200, type: CategoryResponseDto })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<CategoryResponseDto> {
    return this.categoriesService.findOne(id);
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Оновити категорію (тільки адмін)' })
  @ApiResponse({ status: 200, type: CategoryResponseDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    return this.categoriesService.update(id, dto);
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Видалити категорію (тільки адмін)' })
  @ApiResponse({ status: 204 })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.categoriesService.remove(id);
  }
}
