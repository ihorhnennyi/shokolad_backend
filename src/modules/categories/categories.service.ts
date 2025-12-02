import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesQueryDto } from './dto/get-categories-query.dto';
import { PaginatedCategoriesResponseDto } from './dto/paginated-categories-response.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const { parentId, ...rest } = dto;

    const doc = await this.categoryModel.create({
      ...rest,
      parent: parentId ?? null,
    });

    return this.toResponseDto(doc);
  }

  async findAll(query: GetCategoriesQueryDto): Promise<PaginatedCategoriesResponseDto> {
    const { search, parentId, isActive, page = 1, limit = 50 } = query;

    const filter: FilterQuery<CategoryDocument> = {};

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      filter.name = regex;
    }

    if (parentId) {
      filter.parent = parentId;
    }

    if (isActive === 'true') {
      filter.isActive = true;
    }

    if (isActive === 'false') {
      filter.isActive = false;
    }

    const [items, total] = await Promise.all([
      this.categoryModel
        .find(filter)
        .sort({ order: 1, name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.categoryModel.countDocuments(filter).exec(),
    ]);

    return {
      items: items.map((doc) => this.toResponseDto(doc)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<CategoryResponseDto> {
    const doc = await this.categoryModel.findById(id).exec();

    if (!doc) {
      throw new NotFoundException('Категорію не знайдено');
    }

    return this.toResponseDto(doc);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    const { parentId, ...rest } = dto;

    const doc = await this.categoryModel
      .findByIdAndUpdate(
        id,
        {
          ...rest,
          ...(dto.hasOwnProperty('parentId') ? { parent: parentId ?? null } : {}),
        },
        { new: true, runValidators: true },
      )
      .exec();

    if (!doc) {
      throw new NotFoundException('Категорію не знайдено');
    }

    return this.toResponseDto(doc);
  }

  async remove(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException('Категорію не знайдено');
    }
  }

  private toResponseDto(doc: CategoryDocument): CategoryResponseDto {
    return {
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      parentId: doc.parent ? doc.parent.toString() : null,
      imageUrl: doc.imageUrl,
      isActive: doc.isActive,
      order: doc.order,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
