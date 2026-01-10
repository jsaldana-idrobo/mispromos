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
  Query,
} from "@nestjs/common";
import { UserRole } from "@mispromos/shared";
import { BranchService } from "./branch.service";
import { CreateBranchDto } from "./dto/create-branch.dto";
import { UpdateBranchDto } from "./dto/update-branch.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { type AuthRequest } from "../auth/auth.types";

@Controller("branches")
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER, UserRole.ADMIN)
  create(@Body() dto: CreateBranchDto, @Req() req: AuthRequest) {
    if (!req.user) {
      throw new UnauthorizedException("No autenticado");
    }
    return this.branchService.create(dto, req.user);
  }

  @Get()
  findAll(@Query("businessId") businessId?: string) {
    return this.branchService.findAll(businessId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.branchService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER, UserRole.ADMIN)
  update(
    @Param("id") id: string,
    @Body() dto: UpdateBranchDto,
    @Req() req: AuthRequest,
  ) {
    if (!req.user) {
      throw new UnauthorizedException("No autenticado");
    }
    return this.branchService.update(id, dto, req.user);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER, UserRole.ADMIN)
  remove(@Param("id") id: string, @Req() req: AuthRequest) {
    if (!req.user) {
      throw new UnauthorizedException("No autenticado");
    }
    return this.branchService.remove(id, req.user);
  }
}
