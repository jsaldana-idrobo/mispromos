import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type Document } from "mongoose";

@Schema()
export class Branch {
  @Prop({ required: true })
  businessId!: string;

  @Prop({ required: true, trim: true })
  city!: string;

  @Prop()
  zone?: string;

  @Prop({ required: true, trim: true })
  address!: string;

  @Prop()
  lat?: number;

  @Prop()
  lng?: number;

  @Prop()
  phone?: string;

  @Prop({ type: Object })
  openingHours?: Record<string, Array<{ start: string; end: string }>>;

  @Prop({ default: () => new Date() })
  createdAt!: Date;
}

export type BranchDocument = Branch & Document;

export const BranchSchema = SchemaFactory.createForClass(Branch);
BranchSchema.index({ businessId: 1 });
BranchSchema.index({ city: 1 });
