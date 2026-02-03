import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from "class-validator";
import { BusinessType } from "@mispromos/shared";

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(1)
  city!: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  slug?: string;

  @IsEnum(BusinessType)
  type!: BusinessType;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl({ require_protocol: true })
  @IsOptional()
  website?: string;

  @IsString()
  @MinLength(1)
  instagram!: string;
}
