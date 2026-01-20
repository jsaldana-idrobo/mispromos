import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BusinessController } from "./business.controller";
import { BusinessService } from "./business.service";
import { Business, BusinessSchema } from "./business.schema";
import { User, UserSchema } from "../auth/user.schema";
import { EmailService } from "../notifications/email.service";
import { Promotion, PromotionSchema } from "../promotion/promotion.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Business.name,
        schema: BusinessSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Promotion.name,
        schema: PromotionSchema,
      },
    ]),
  ],
  controllers: [BusinessController],
  providers: [BusinessService, EmailService],
})
export class BusinessModule {}
