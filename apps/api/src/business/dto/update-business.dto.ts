import { IsArray, IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { BusinessType } from "@mispromos/shared";

export class UpdateBusinessDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  slug?: string;

  @IsEnum(BusinessType)
  @IsOptional()
  type?: BusinessType;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];

  @IsString()
  @IsOptional()
  description?: string;
}
