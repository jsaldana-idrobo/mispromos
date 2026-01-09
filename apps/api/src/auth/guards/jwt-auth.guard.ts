import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { type AuthRequest } from "../auth.types";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    const token = req.cookies?.auth;
    if (!token) {
      throw new UnauthorizedException("No autenticado");
    }

    const payload = await this.authService.verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    return true;
  }
}
