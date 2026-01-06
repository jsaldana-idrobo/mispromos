import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateCategoryDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  slug?: string;
}
