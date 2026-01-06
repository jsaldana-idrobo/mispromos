import { IsDateString, IsOptional, IsString, MinLength, IsEnum } from "class-validator";
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
}
