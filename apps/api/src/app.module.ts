import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BusinessModule } from "./business/business.module";
import { BranchModule } from "./branch/branch.module";
import { PromotionModule } from "./promotion/promotion.module";
import { AuthModule } from "./auth/auth.module";
import { CityModule } from "./city/city.module";
import { CategoryModule } from "./category/category.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.local`, `.env`],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>("MONGODB_URI");
        if (!uri) {
          throw new Error("MONGODB_URI no está configurado");
        }
        return {
          uri,
          serverSelectionTimeoutMS: 3000,
          connectTimeoutMS: 3000,
        };
      },
    }),
    BusinessModule,
    BranchModule,
    PromotionModule,
    AuthModule,
    CityModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
