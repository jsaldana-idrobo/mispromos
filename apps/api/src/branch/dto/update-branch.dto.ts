import { Type } from "class-transformer";
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class UpdateBranchDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  businessId?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  zone?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  address?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  lat?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  lng?: number;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsObject()
  @IsOptional()
  openingHours?: Record<string, Array<{ start: string; end: string }>>;
}
