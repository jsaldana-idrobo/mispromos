import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
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

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsArray()
  @IsEnum(DayOfWeek, { each: true })
  @IsOptional()
  daysOfWeek?: DayOfWeek[];

  @IsString()
  @MinLength(1)
  @IsOptional()
  startHour?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  endHour?: string;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
