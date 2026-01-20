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
import { BusinessType, PromotionType, UserRole } from "@mispromos/shared";
import { PromotionService } from "./promotion.service";
import { CreatePromotionDto } from "./dto/create-promotion.dto";
import { UpdatePromotionDto } from "./dto/update-promotion.dto";
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
    const parsed = this.parseActiveQuery(req.query);
    const featuredParam = parsed.featuredRaw?.trim().toLowerCase();
    let featured: boolean | undefined;
    if (featuredParam === "true") {
      featured = true;
    } else if (featuredParam === "false") {
      featured = false;
    }
    return this.promotionService.findActiveByCity({
      city: parsed.city,
      at: parsed.at,
      promoType: parsed.promoType,
      category: parsed.category,
      businessType: parsed.businessType,
      featured,
      q: parsed.q,
      offset: parsed.offset,
      limit: parsed.limit,
    });
  }

  @Get("active-feed")
  findActiveFeed(@Req() req: Request) {
    const parsed = this.parseActiveQuery(req.query);
    const includeFeatured =
      parsed.includeFeaturedRaw?.trim().toLowerCase() !== "false";
    return this.promotionService.findActiveFeed({
      city: parsed.city,
      at: parsed.at,
      promoType: parsed.promoType,
      category: parsed.category,
      businessType: parsed.businessType,
      q: parsed.q,
      offset: parsed.offset,
      limit: parsed.limit,
      includeFeatured,
      featuredLimit: parsed.featuredLimit,
    });
  }

  private parseActiveQuery(query: Request["query"]) {
    const raw = query as Record<string, string | undefined>;
    const city = raw.city?.trim() || undefined;
    const at = raw.at?.trim() || undefined;
    const promoType = Object.values(PromotionType).includes(
      raw.promoType as PromotionType,
    )
      ? (raw.promoType as PromotionType)
      : undefined;
    const category = raw.category?.trim() || undefined;
    const businessType = Object.values(BusinessType).includes(
      raw.businessType as BusinessType,
    )
      ? (raw.businessType as BusinessType)
      : undefined;
    const q = raw.q?.trim() || undefined;
    const offset = Number.isFinite(Number(raw.offset))
      ? Number(raw.offset)
      : undefined;
    const limit = Number.isFinite(Number(raw.limit))
      ? Number(raw.limit)
      : undefined;
    const featuredLimit = Number.isFinite(Number(raw.featuredLimit))
      ? Number(raw.featuredLimit)
      : undefined;
    return {
      city,
      at,
      promoType,
      category,
      businessType,
      q,
      offset,
      limit,
      featuredLimit,
      featuredRaw: raw.featured,
      includeFeaturedRaw: raw.includeFeatured,
    };
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
