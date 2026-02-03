import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import bcrypt from "bcryptjs";
import { User, type UserDocument } from "./user.schema";
import { Business, type BusinessDocument } from "../business/business.schema";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UserRole } from "@mispromos/shared";
import { buildUniqueSlug } from "../common/slug";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Business.name)
    private readonly businessModel: Model<BusinessDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userModel.findOne({ email: dto.email }).exec();
    if (existing) {
      throw new BadRequestException("El email ya está registrado");
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const created = await this.userModel.create({
      email: dto.email,
      password: hashed,
      pendingPassword: dto.password,
      role: UserRole.BUSINESS_OWNER,
    });

    try {
      const slug = await buildUniqueSlug(
        this.businessModel,
        dto.slug?.length ? dto.slug : dto.name,
      );
      await this.businessModel.create({
        name: dto.name,
        city: dto.city,
        slug,
        type: dto.type,
        categories: dto.categories ?? [],
        description: dto.description,
        website: dto.website,
        instagram: dto.instagram,
        ownerId: created.id,
        approved: false,
      });
    } catch (error) {
      await this.userModel.findByIdAndDelete(created.id).exec();
      if (
        typeof error === "object" &&
        error &&
        "code" in error &&
        (error as { code?: number }).code === 11000
      ) {
        throw new BadRequestException("El slug ya está registrado");
      }
      throw new BadRequestException("No se pudo crear la solicitud");
    }

    return { id: created.id, email: created.email, role: created.role };
  }

  async validateLogin(dto: LoginDto) {
    const user = await this.userModel
      .findOne({ email: dto.email })
      .select("+password")
      .exec();

    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    if (user.role === UserRole.BUSINESS_OWNER) {
      const approved = await this.businessModel
        .findOne({ ownerId: String(user._id), approved: true })
        .select("_id")
        .exec();
      if (!approved) {
        throw new ForbiddenException(
          "Tu solicitud sigue pendiente de aprobación.",
        );
      }
    }

    return user;
  }

  async createAccessToken(payload: {
    id: string;
    role: UserRole;
    email: string;
  }) {
    return this.jwtService.sign({
      sub: payload.id,
      role: payload.role,
      email: payload.email,
    });
  }

  async verifyAccessToken(token: string) {
    return this.jwtService.verify<{
      sub: string;
      role: UserRole;
      email?: string;
    }>(token);
  }

  async findUserById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async updateUserRole(id: string, role: UserRole) {
    const updated = await this.userModel
      .findByIdAndUpdate(id, { role }, { new: true })
      .exec();
    return updated;
  }
}
