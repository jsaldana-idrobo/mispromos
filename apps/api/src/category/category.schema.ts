import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type Document } from "mongoose";

@Schema()
export class Category {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true, lowercase: true })
  slug!: string;

  @Prop({ default: () => new Date() })
  createdAt!: Date;
}

export type CategoryDocument = Category & Document;

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.index({ slug: 1 }, { unique: true });
