import { IsString, Length, MinLength } from "class-validator";

export class CreateCityDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @Length(2, 2)
  countryCode!: string;
}
