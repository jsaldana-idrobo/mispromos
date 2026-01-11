import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, type Document } from "mongoose";
import { PromotionType, DayOfWeek } from "@mispromos/shared";

const promotionTypeValues = Object.values(PromotionType) as PromotionType[];
const dayOfWeekValues = DayOfWeek as readonly string[];

@Schema()
export class Promotion {
  @Prop({ required: true })
  businessId!: string;

  @Prop({ type: String, default: null })
  branchId?: string | null;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: promotionTypeValues })
  promoType!: PromotionType;

  @Prop({ type: MongooseSchema.Types.Mixed })
  value?: number | string;

  @Prop({ type: Date, default: null })
  startDate?: Date | null;

  @Prop({ type: Date, default: null })
  endDate?: Date | null;

  @Prop({ type: String, trim: true, default: null })
  imageUrl?: string | null;

  @Prop({ type: [String], required: true, enum: dayOfWeekValues })
  daysOfWeek!: string[];

  @Prop({ type: String, default: null })
  startHour?: string | null;

  @Prop({ type: String, default: null })
  endHour?: string | null;

  @Prop({ default: true })
  active!: boolean;

  @Prop({ default: false })
  featured!: boolean;

  @Prop({ default: () => new Date() })
  createdAt!: Date;
}

export type PromotionDocument = Promotion & Document;

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
PromotionSchema.index({ businessId: 1 });
PromotionSchema.index({ branchId: 1 });
PromotionSchema.index({
  active: 1,
  startDate: 1,
  endDate: 1,
  daysOfWeek: 1,
  startHour: 1,
  endHour: 1,
});
