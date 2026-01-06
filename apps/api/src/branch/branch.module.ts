import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BranchController } from "./branch.controller";
import { BranchService } from "./branch.service";
import { Branch, BranchSchema } from "./branch.schema";
import { Business, BusinessSchema } from "../business/business.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
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
  controllers: [BranchController],
  providers: [BranchService],
})
export class BranchModule {}
