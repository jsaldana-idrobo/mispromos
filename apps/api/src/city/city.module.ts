import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CityController } from "./city.controller";
import { CityService } from "./city.service";
import { City, CitySchema } from "./city.schema";
import { Business, BusinessSchema } from "../business/business.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: City.name,
        schema: CitySchema,
      },
      {
        name: Business.name,
        schema: BusinessSchema,
      },
    ]),
  ],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
