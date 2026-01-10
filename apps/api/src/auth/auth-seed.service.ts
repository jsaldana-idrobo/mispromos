import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import bcrypt from "bcryptjs";
import { User, type UserDocument } from "./user.schema";
import { UserRole } from "@mispromos/shared";

@Injectable()
export class AuthSeedService implements OnModuleInit {
  private readonly logger = new Logger(AuthSeedService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async onModuleInit() {
    const email = this.configService.get<string>("SEED_ADMIN_EMAIL");
    const password = this.configService.get<string>("SEED_ADMIN_PASSWORD");

    if (!email || !password) {
      return;
    }

    const existing = await this.userModel.findOne({ email }).exec();
    if (existing) {
      if (existing.role !== UserRole.ADMIN) {
        existing.role = UserRole.ADMIN;
        await existing.save();
        this.logger.log("Usuario existente promovido a ADMIN");
      }
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    await this.userModel.create({
      email,
      password: hashed,
      role: UserRole.ADMIN,
    });
    this.logger.log("Usuario ADMIN creado desde variables de entorno");
  }
}
