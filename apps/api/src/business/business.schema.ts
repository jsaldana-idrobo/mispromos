import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type Document } from "mongoose";
import { BusinessType } from "@mispromos/shared";

const businessTypeValues = Object.values(BusinessType) as BusinessType[];

@Schema()
export class Business {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true, lowercase: true })
  slug!: string;

  @Prop({ required: true, enum: businessTypeValues })
  type!: BusinessType;

  @Prop({ type: [String], default: [] })
  categories!: string[];

  @Prop()
  description?: string;

  @Prop({ required: true })
  ownerId!: string;

  @Prop({ default: false })
  verified!: boolean;

  @Prop({ default: () => new Date() })
  createdAt!: Date;
}

export type BusinessDocument = Business & Document;

export const BusinessSchema = SchemaFactory.createForClass(Business);
BusinessSchema.index({ slug: 1 }, { unique: true });
BusinessSchema.index({ ownerId: 1 });
