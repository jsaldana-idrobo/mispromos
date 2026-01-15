import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { type AuthRequest } from "../auth.types";

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    const token = req.cookies?.auth;
    if (!token) {
      return true;
    }
    return this.attachUserIfValid(req, token);
  }

  private async attachUserIfValid(req: AuthRequest, token: string) {
    try {
      const payload = await this.authService.verifyAccessToken(token);
      req.user = { id: payload.sub, role: payload.role, email: payload.email };
      return true;
    } catch {
      // Invalid tokens should not grant access to protected routes.
      return false;
    }
  }
}
