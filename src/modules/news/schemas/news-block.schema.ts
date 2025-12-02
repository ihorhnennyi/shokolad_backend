import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { NewsBlockType } from '../enums/news-block-type.enum';

@Schema({ _id: false })
export class NewsBlock {
  @Prop({ enum: NewsBlockType, required: true })
  type: NewsBlockType;

  @Prop()
  content?: string;

  @Prop()
  imageUrl?: string;

  @Prop({ type: [String] })
  items?: string[];
}

export type NewsBlockDocument = NewsBlock & Document;

export const NewsBlockSchema = SchemaFactory.createForClass(NewsBlock);
