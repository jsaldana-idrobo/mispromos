import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  ValidateIf,
} from "class-validator";
import { PromotionType, DayOfWeek } from "@mispromos/shared";

export class CreatePromotionDto {
  @IsString()
  @MinLength(1)
  businessId!: string;

  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsString()
  branchId?: string | null;

  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PromotionType)
  promoType!: PromotionType;

  @IsString()
  @IsOptional()
  value?: string;

  @ValidateIf(
    (object, value) =>
      (value !== null && value !== undefined) ||
      (object.endDate !== null && object.endDate !== undefined),
  )
  @IsDateString()
  startDate?: string | null;

  @ValidateIf(
    (object, value) =>
      (value !== null && value !== undefined) ||
      (object.startDate !== null && object.startDate !== undefined),
  )
  @IsDateString()
  endDate?: string | null;

  @IsUrl()
  @IsOptional()
  imageUrl?: string | null;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsArray()
  @IsEnum(DayOfWeek, { each: true })
  daysOfWeek!: DayOfWeek[];

  @ValidateIf(
    (object, value) =>
      (value !== null && value !== undefined) ||
      (object.endHour !== null && object.endHour !== undefined),
  )
  @IsString()
  @MinLength(1)
  startHour?: string | null;

  @ValidateIf(
    (object, value) =>
      (value !== null && value !== undefined) ||
      (object.startHour !== null && object.startHour !== undefined),
  )
  @IsString()
  @MinLength(1)
  endHour?: string | null;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
