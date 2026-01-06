import { IsArray, IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { BusinessType } from "@mispromos/shared";

export class CreateBusinessDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(1)
  slug!: string;

  @IsEnum(BusinessType)
  type!: BusinessType;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];

  @IsString()
  @IsOptional()
  description?: string;
}
