import { slugify } from '@common/utils/slugify.util';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: Types.ObjectId, ref: Category.name, default: null })
  parent?: Types.ObjectId | null;

  @Prop({ trim: true })
  imageUrl?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type CategoryDocument = Category & Document;

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.pre<CategoryDocument>('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }

  next();
});
