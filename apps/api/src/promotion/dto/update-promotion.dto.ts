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

export class UpdatePromotionDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  businessId?: string;

  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsString()
  branchId?: string | null;

  @IsString()
  @MinLength(1)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PromotionType)
  @IsOptional()
  promoType?: PromotionType;

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

  @IsArray()
  @IsEnum(DayOfWeek, { each: true })
  @IsOptional()
  daysOfWeek?: DayOfWeek[];

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
