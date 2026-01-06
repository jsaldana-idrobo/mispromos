import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PromotionController } from "./promotion.controller";
import { PromotionService } from "./promotion.service";
import { Promotion, PromotionSchema } from "./promotion.schema";
import { Branch, BranchSchema } from "../branch/branch.schema";
import { Business, BusinessSchema } from "../business/business.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Promotion.name,
        schema: PromotionSchema,
      },
      {
        name: Branch.name,
        schema: BranchSchema,
      },
      {
        name: Business.name,
        schema: BusinessSchema,
      },
    ]),
  ],
  controllers: [PromotionController],
  providers: [PromotionService],
})
export class PromotionModule {}
