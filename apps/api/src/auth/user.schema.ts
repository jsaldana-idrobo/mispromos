import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type Document } from "mongoose";
import { UserRole } from "@mispromos/shared";

const userRoleValues = Object.values(UserRole) as UserRole[];

@Schema()
export class User {
  @Prop({ required: true, trim: true, lowercase: true, unique: true })
  email!: string;

  @Prop({ required: true, select: false })
  password!: string;

  @Prop({ required: true, enum: userRoleValues, default: UserRole.USER })
  role!: UserRole;

  @Prop({ default: () => new Date() })
  createdAt!: Date;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
