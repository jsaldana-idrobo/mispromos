import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "@mispromos/shared";
import { type AuthRequest } from "../auth.types";
import { ROLES_KEY } from "../roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest<AuthRequest>();
    if (!req.user) {
      throw new UnauthorizedException("No autenticado");
    }

    if (!requiredRoles.includes(req.user.role)) {
      throw new ForbiddenException("No autorizado");
    }

    return true;
  }
}
