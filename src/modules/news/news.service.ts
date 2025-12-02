import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { promises as fs } from 'fs';
import { Model } from 'mongoose';
import * as path from 'path';
import { CreateNewsDto } from './dto/create-news.dto';
import { GetNewsQueryDto } from './dto/get-news-query.dto';
import { NewsResponseDto } from './dto/news-response.dto';
import { PaginatedNewsResponseDto } from './dto/paginated-news-response.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsBlockType } from './enums/news-block-type.enum';
import { NewsBlock } from './schemas/news-block.schema';
import { News, NewsDocument } from './schemas/news.schema';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name)
    private readonly newsModel: Model<NewsDocument>,
  ) {}

  private getNewsUploadsRoot(): string {
    return path.resolve(process.cwd(), 'uploads', 'news');
  }

  private async ensureDirExists(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true });
  }

  private mapToResponse(news: NewsDocument): NewsResponseDto {
    return {
      id: news._id.toString(),
      title: news.title,
      description: news.description,
      blocks: news.blocks as any,
      folderPath: news.folderPath,
      createdAt: news.createdAt,
      updatedAt: news.updatedAt,
    };
  }

  async create(dto: CreateNewsDto, files: Express.Multer.File[] = []): Promise<NewsResponseDto> {
    const created = new this.newsModel({
      title: dto.title,
      description: dto.description,
      blocks: dto.blocks ?? [],
    });

    const saved = await created.save();

    const uploadsRoot = this.getNewsUploadsRoot();
    const folderPath = path.join(uploadsRoot, saved._id.toString());

    await this.ensureDirExists(folderPath);

    const imageBlocks: NewsBlock[] = [];

    if (files.length) {
      for (const file of files) {
        const ext = path.extname(file.originalname) || '';
        const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`;
        const filePath = path.join(folderPath, fileName);

        await fs.writeFile(filePath, file.buffer);

        const fileUrl = `/uploads/news/${saved._id.toString()}/${fileName}`;

        imageBlocks.push({
          type: NewsBlockType.IMAGE,
          imageUrl: fileUrl,
        });
      }
    }

    if (imageBlocks.length) {
      saved.blocks = [...(saved.blocks ?? []), ...imageBlocks];
    }

    saved.folderPath = folderPath;
    await saved.save();

    return this.mapToResponse(saved);
  }

  async update(
    id: string,
    dto: UpdateNewsDto,
    files: Express.Multer.File[] = [],
  ): Promise<NewsResponseDto> {
    const news = await this.newsModel.findById(id);

    if (!news) {
      throw new NotFoundException('Новина не знайдена');
    }

    if (dto.title !== undefined) {
      news.title = dto.title;
    }

    if (dto.description !== undefined) {
      news.description = dto.description;
    }

    if (dto.blocks !== undefined) {
      news.blocks = dto.blocks as any;
    }

    const uploadsRoot = this.getNewsUploadsRoot();
    const folderPath = news.folderPath || path.join(uploadsRoot, news._id.toString());

    await this.ensureDirExists(folderPath);

    const imageBlocks: NewsBlock[] = [];

    if (files.length) {
      for (const file of files) {
        const ext = path.extname(file.originalname) || '';
        const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`;
        const filePath = path.join(folderPath, fileName);

        await fs.writeFile(filePath, file.buffer);

        const fileUrl = `/uploads/news/${news._id.toString()}/${fileName}`;

        imageBlocks.push({
          type: NewsBlockType.IMAGE,
          imageUrl: fileUrl,
        });
      }
    }

    if (imageBlocks.length) {
      news.blocks = [...(news.blocks ?? []), ...imageBlocks];
    }

    news.folderPath = folderPath;

    const saved = await news.save();

    return this.mapToResponse(saved);
  }

  async findAll(query: GetNewsQueryDto): Promise<PaginatedNewsResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim();

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.newsModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.newsModel.countDocuments(filter),
    ]);

    return {
      items: items.map((news) => this.mapToResponse(news)),
      page,
      limit,
      total,
    };
  }
}
