import { IsOptional, IsString, Length, MinLength } from "class-validator";

export class UpdateCityDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  name?: string;

  @IsString()
  @Length(2, 2)
  @IsOptional()
  countryCode?: string;
}
