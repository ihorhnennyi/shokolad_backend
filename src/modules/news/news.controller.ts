import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';

import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { UserRole } from '@modules/users/enums/user-role.enum';
import { CreateNewsDto } from './dto/create-news.dto';
import { GetNewsQueryDto } from './dto/get-news-query.dto';
import { NewsResponseDto } from './dto/news-response.dto';
import { PaginatedNewsResponseDto } from './dto/paginated-news-response.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsService } from './news.service';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание новости (только админ, с файлами)' })
  @ApiCreatedResponse({ type: NewsResponseDto })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'ІЧМ отримав категорію А' },
        description: {
          type: 'string',
          example: 'Короткий опис новини для превʼю на головній сторінці.',
        },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
      required: ['title', 'description'],
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
    }),
  )
  async create(
    @Body() dto: CreateNewsDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<NewsResponseDto> {
    return this.newsService.create(dto, files);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Оновлення новини (тільки адмін, з файлами)' })
  @ApiOkResponse({ type: NewsResponseDto })
  @ApiParam({
    name: 'id',
    description: 'ID новини',
    example: '665f3a5a0f1b2c3d4e5f6a7b',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Оновлений заголовок новини' },
        description: {
          type: 'string',
          example: 'Оновлений короткий опис новини.',
        },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateNewsDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<NewsResponseDto> {
    return this.newsService.update(id, dto, files);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Отримати список новин (публічний, з пагінацією та пошуком)',
  })
  @ApiOkResponse({ type: PaginatedNewsResponseDto })
  async findAll(@Query() query: GetNewsQueryDto): Promise<PaginatedNewsResponseDto> {
    return this.newsService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Отримати одну новину за ID (публічний)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID новини',
    example: '665f3a5a0f1b2c3d4e5f6a7b',
  })
  @ApiOkResponse({ type: NewsResponseDto })
  @ApiNotFoundResponse({
    description: 'Новина не знайдена',
  })
  async findOne(@Param('id') id: string): Promise<NewsResponseDto> {
    return this.newsService.findOne(id);
  }
}
