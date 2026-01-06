import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type Document } from "mongoose";

@Schema()
export class City {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, uppercase: true, trim: true })
  countryCode!: string;

  @Prop({ default: () => new Date() })
  createdAt!: Date;
}

export type CityDocument = City & Document;

export const CitySchema = SchemaFactory.createForClass(City);
CitySchema.index({ name: 1, countryCode: 1 }, { unique: true });
