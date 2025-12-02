import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { NewsBlock, NewsBlockSchema } from './news-block.schema';

@Schema({ timestamps: true })
export class News {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ type: [NewsBlockSchema], default: [] })
  blocks: NewsBlock[];

  @Prop({ trim: true })
  folderPath: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type NewsDocument = News & Document;

export const NewsSchema = SchemaFactory.createForClass(News);
