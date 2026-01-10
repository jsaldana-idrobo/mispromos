import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
  Req,
} from "@nestjs/common";
import { UserRole } from "@mispromos/shared";
import { PromotionService } from "./promotion.service";
import { CreatePromotionDto } from "./dto/create-promotion.dto";
import { UpdatePromotionDto } from "./dto/update-promotion.dto";
import { PromotionType, BusinessType } from "@mispromos/shared";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { type AuthRequest } from "../auth/auth.types";
import { type Request } from "express";

@Controller("promotions")
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER, UserRole.ADMIN)
  create(@Body() dto: CreatePromotionDto, @Req() req: AuthRequest) {
    if (!req.user) {
      throw new UnauthorizedException("No autenticado");
    }
    return this.promotionService.create(dto, req.user);
  }

  @Get()
  findAll(@Query("businessId") businessId?: string) {
    return this.promotionService.findAll(businessId);
  }

  @Get("active")
  findActive(@Req() req: Request) {
    const query = req.query as Record<string, string | undefined>;
    const city = query.city?.trim() || undefined;
    const at = query.at?.trim() || undefined;
    const promoType = Object.values(PromotionType).includes(
      query.promoType as PromotionType,
    )
      ? (query.promoType as PromotionType)
      : undefined;
    const category = query.category?.trim() || undefined;
    const businessType = Object.values(BusinessType).includes(
      query.businessType as BusinessType,
    )
      ? (query.businessType as BusinessType)
      : undefined;
    const q = query.q?.trim() || undefined;
    const offset = Number.isFinite(Number(query.offset))
      ? Number(query.offset)
      : undefined;
    const limit = Number.isFinite(Number(query.limit))
      ? Number(query.limit)
      : undefined;
    return this.promotionService.findActiveByCity(
      city,
      at,
      promoType,
      category,
      businessType,
      q,
      offset,
      limit,
    );
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.promotionService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER, UserRole.ADMIN)
  update(
    @Param("id") id: string,
    @Body() dto: UpdatePromotionDto,
    @Req() req: AuthRequest,
  ) {
    if (!req.user) {
      throw new UnauthorizedException("No autenticado");
    }
    return this.promotionService.update(id, dto, req.user);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER, UserRole.ADMIN)
  remove(@Param("id") id: string, @Req() req: AuthRequest) {
    if (!req.user) {
      throw new UnauthorizedException("No autenticado");
    }
    return this.promotionService.remove(id, req.user);
  }
}
