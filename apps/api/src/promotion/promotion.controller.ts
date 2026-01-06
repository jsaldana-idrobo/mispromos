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
import { ActivePromotionsQueryDto } from "./dto/active-promotions.query";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { type AuthRequest } from "../auth/auth.types";

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
  findActive(@Query() query: ActivePromotionsQueryDto) {
    return this.promotionService.findActiveByCity(
      query.city,
      query.at,
      query.promoType,
      query.category,
      query.businessType,
      query.q
    );
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.promotionService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER, UserRole.ADMIN)
  update(@Param("id") id: string, @Body() dto: UpdatePromotionDto, @Req() req: AuthRequest) {
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
