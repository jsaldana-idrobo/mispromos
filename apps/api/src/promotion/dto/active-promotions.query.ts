import { IsDateString, IsOptional, IsString, MinLength, IsEnum, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";
import { PromotionType, BusinessType } from "@mispromos/shared";

export class ActivePromotionsQueryDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  city?: string;

  @IsDateString()
  @IsOptional()
  at?: string;

  @IsEnum(PromotionType)
  @IsOptional()
  promoType?: PromotionType;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(BusinessType)
  @IsOptional()
  businessType?: BusinessType;

  @IsString()
  @IsOptional()
  q?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
