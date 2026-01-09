import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import bcrypt from "bcryptjs";
import { User, type UserDocument } from "./user.schema";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UserRole } from "@mispromos/shared";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService
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
      role: UserRole.BUSINESS_OWNER,
    });

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

    return user;
  }

  async createAccessToken(payload: { id: string; role: UserRole; email: string }) {
    return this.jwtService.sign({ sub: payload.id, role: payload.role, email: payload.email });
  }

  async verifyAccessToken(token: string) {
    return this.jwtService.verify<{ sub: string; role: UserRole; email?: string }>(token);
  }

  async findUserById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async updateUserRole(id: string, role: UserRole) {
    const updated = await this.userModel.findByIdAndUpdate(id, { role }, { new: true }).exec();
    return updated;
  }
}
