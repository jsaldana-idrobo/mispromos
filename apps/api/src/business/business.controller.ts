import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
  Req,
} from "@nestjs/common";
import { UserRole } from "@mispromos/shared";
import { BusinessService } from "./business.service";
import { CreateBusinessDto } from "./dto/create-business.dto";
import { UpdateBusinessDto } from "./dto/update-business.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { type AuthRequest } from "../auth/auth.types";

@Controller("businesses")
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER, UserRole.ADMIN)
  create(@Body() dto: CreateBusinessDto, @Req() req: AuthRequest) {
    if (!req.user) {
      throw new UnauthorizedException("No autenticado");
    }
    return this.businessService.create(dto, req.user);
  }

  @Get()
  findAll() {
    return this.businessService.findAll();
  }

  @Get("mine")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER, UserRole.ADMIN)
  findMine(@Req() req: AuthRequest) {
    if (!req.user) {
      throw new UnauthorizedException("No autenticado");
    }
    return this.businessService.findByOwner(req.user.id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.businessService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER, UserRole.ADMIN)
  update(@Param("id") id: string, @Body() dto: UpdateBusinessDto, @Req() req: AuthRequest) {
    if (!req.user) {
      throw new UnauthorizedException("No autenticado");
    }
    return this.businessService.update(id, dto, req.user);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER, UserRole.ADMIN)
  remove(@Param("id") id: string, @Req() req: AuthRequest) {
    if (!req.user) {
      throw new UnauthorizedException("No autenticado");
    }
    return this.businessService.remove(id, req.user);
  }
}
