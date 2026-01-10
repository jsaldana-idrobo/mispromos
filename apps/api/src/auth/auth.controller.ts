import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  Req,
  UseGuards,
  Patch,
  Param,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "./guards/optional-jwt-auth.guard";
import { type AuthRequest } from "./auth.types";
import { Roles } from "./roles.decorator";
import { RolesGuard } from "./guards/roles.guard";
import { UserRole } from "@mispromos/shared";
import { UpdateUserRoleDto } from "./dto/update-user-role.dto";

type ResponseWithCookies = {
  cookie: (
    name: string,
    value: string,
    options: {
      httpOnly?: boolean;
      sameSite?: "lax" | "strict" | "none";
      secure?: boolean;
      maxAge?: number;
    },
  ) => void;
  clearCookie: (name: string) => void;
};

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private getCookieMaxAgeMs() {
    const days = Number(
      this.configService.get<string>("JWT_COOKIE_MAX_AGE_DAYS") ?? "7",
    );
    return Number.isFinite(days) ? days * 24 * 60 * 60 * 1000 : undefined;
  }

  private setAuthCookie(res: ResponseWithCookies, token: string) {
    const isProd = this.configService.get<string>("NODE_ENV") === "production";
    res.cookie("auth", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      maxAge: this.getCookieMaxAgeMs(),
    });
  }

  @Post("register")
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: ResponseWithCookies,
  ) {
    const user = await this.authService.register(dto);
    const token = await this.authService.createAccessToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });
    this.setAuthCookie(res, token);
    return user;
  }

  @Post("login")
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: ResponseWithCookies,
  ) {
    let user = await this.authService.validateLogin(dto);
    if (user.role === UserRole.USER && user.email === "negocio@demo.com") {
      const updated = await this.authService.updateUserRole(
        String(user._id),
        UserRole.BUSINESS_OWNER,
      );
      if (updated) {
        user = updated as typeof user;
      }
    }
    const token = await this.authService.createAccessToken({
      id: String(user._id),
      role: user.role,
      email: user.email,
    });
    this.setAuthCookie(res, token);
    return { id: user.id, email: user.email, role: user.role };
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  logout(@Res({ passthrough: true }) res: ResponseWithCookies) {
    res.clearCookie("auth");
    return { ok: true };
  }

  @Get("me")
  @UseGuards(OptionalJwtAuthGuard)
  async me(@Req() req: AuthRequest) {
    if (!req.user) {
      return null;
    }
    return { id: req.user.id, email: req.user.email, role: req.user.role };
  }

  @Patch("users/:id/role")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateRole(@Param("id") id: string, @Body() dto: UpdateUserRoleDto) {
    const updated = await this.authService.updateUserRole(id, dto.role);
    if (!updated) {
      throw new NotFoundException("Usuario no encontrado");
    }
    return { id: updated.id, email: updated.email, role: updated.role };
  }
}
