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

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsArray()
  @IsEnum(DayOfWeek, { each: true })
  daysOfWeek!: DayOfWeek[];

  @IsString()
  @MinLength(1)
  startHour!: string;

  @IsString()
  @MinLength(1)
  endHour!: string;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
