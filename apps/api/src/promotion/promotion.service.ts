import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DayOfWeek, UserRole } from "@mispromos/shared";
import { Promotion, type PromotionDocument } from "./promotion.schema";
import { CreatePromotionDto } from "./dto/create-promotion.dto";
import { UpdatePromotionDto } from "./dto/update-promotion.dto";
import { Branch, type BranchDocument } from "../branch/branch.schema";
import { Business, type BusinessDocument } from "../business/business.schema";

type Actor = {
  id: string;
  role: UserRole;
};

@Injectable()
export class PromotionService {
  constructor(
    @InjectModel(Promotion.name)
    private readonly promotionModel: Model<PromotionDocument>,
    @InjectModel(Branch.name)
    private readonly branchModel: Model<BranchDocument>,
    @InjectModel(Business.name)
    private readonly businessModel: Model<BusinessDocument>
  ) {}

  private async assertBusinessOwner(businessId: string, actor: Actor) {
    if (actor.role === UserRole.ADMIN) {
      return;
    }
    const business = await this.businessModel.findById(businessId).select("ownerId").exec();
    if (!business) {
      throw new NotFoundException("Negocio no encontrado");
    }
    if (business.ownerId !== actor.id) {
      throw new ForbiddenException("No autorizado");
    }
  }

  private async assertBranchMatchesBusiness(branchId: string, businessId: string) {
    const branch = await this.branchModel.findById(branchId).select("businessId").exec();
    if (!branch) {
      throw new NotFoundException("Sede no encontrada");
    }
    if (branch.businessId !== businessId) {
      throw new BadRequestException("La sede no pertenece al negocio");
    }
  }

  async create(dto: CreatePromotionDto, actor: Actor) {
    await this.assertBusinessOwner(dto.businessId, actor);
    if (dto.branchId) {
      await this.assertBranchMatchesBusiness(dto.branchId, dto.businessId);
    }
    const created = await this.promotionModel.create(dto);
    return created;
  }

  async findAll(businessId?: string) {
    if (businessId) {
      return this.promotionModel.find({ businessId }).exec();
    }
    return this.promotionModel.find().exec();
  }

  private getDayOfWeek(date: Date): DayOfWeek {
    const days: DayOfWeek[] = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return days[date.getDay()];
  }

  private formatTime(date: Date) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  private getDayOfWeekByIndex(index: number): DayOfWeek {
    const days: DayOfWeek[] = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return days[index];
  }

  private getTimePartsInZone(date: Date, timeZone: string) {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const values: Record<string, string> = {};
    for (const part of parts) {
      values[part.type] = part.value;
    }
    const year = Number(values.year);
    const month = Number(values.month);
    const day = Number(values.day);
    const hour = Number(values.hour);
    const minute = Number(values.minute);
    const second = Number(values.second);
    const zonedDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    return {
      day: this.getDayOfWeekByIndex(zonedDate.getUTCDay()),
      time: `${values.hour}:${values.minute}`,
    };
  }

  private escapeRegex(input: string) {
    return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  async findActiveByCity(
    city?: string,
    at?: string,
    promoType?: string,
    category?: string,
    businessType?: string,
    q?: string,
    offset?: number,
    limit?: number
  ) {
    const now = at ? new Date(at) : new Date();
    if (Number.isNaN(now.valueOf())) {
      throw new BadRequestException("Formato de fecha inválido");
    }

    const { day, time } = this.getTimePartsInZone(now, "America/Bogota");

    let branchFilter: Record<string, unknown> = {};
    if (city) {
      const branchIds = await this.branchModel
        .find({ city })
        .select("_id")
        .lean()
        .exec();

      const branchIdStrings = branchIds.map((branch) => String(branch._id));

      branchFilter =
        branchIdStrings.length > 0
          ? {
              $or: [
                { branchId: null },
                { branchId: { $exists: false } },
                { branchId: { $in: branchIdStrings } },
              ],
            }
          : {
              $or: [{ branchId: null }, { branchId: { $exists: false } }],
            };
    }

    let businessFilter: Record<string, unknown> = {};
    if (category || businessType) {
      const businessQuery: Record<string, unknown> = {};
      if (category) {
        businessQuery.categories = category;
      }
      if (businessType) {
        businessQuery.type = businessType;
      }
      const businesses = await this.businessModel
        .find(businessQuery)
        .select("_id")
        .lean()
        .exec();
      const businessIds = businesses.map((business) => String(business._id));
      businessFilter =
        businessIds.length > 0
          ? { businessId: { $in: businessIds } }
          : { businessId: "__none__" };
    }

    const promoTypeFilter = promoType ? { promoType } : {};
    const queryFilter = q
      ? {
          $or: [
            { title: { $regex: this.escapeRegex(q), $options: "i" } },
            { description: { $regex: this.escapeRegex(q), $options: "i" } },
          ],
        }
      : {};

    const safeLimit = Math.min(Math.max(limit ?? 10, 1), 50);
    const safeOffset = Math.max(offset ?? 0, 0);

    const promos = await this.promotionModel
      .find({
        ...branchFilter,
        ...businessFilter,
        ...promoTypeFilter,
        ...queryFilter,
        active: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
        daysOfWeek: day,
        startHour: { $lte: time },
        endHour: { $gte: time },
      })
      .sort({ createdAt: -1 })
      .skip(safeOffset)
      .limit(safeLimit)
      .lean()
      .exec();

    const businessIds = Array.from(
      new Set(promos.map((promo) => promo.businessId).filter(Boolean))
    );
    const businesses = businessIds.length
      ? await this.businessModel
          .find({ _id: { $in: businessIds } })
          .select("_id name slug categories instagram")
          .lean()
          .exec()
      : [];
    const businessMap = new Map(businesses.map((business) => [String(business._id), business]));

    return promos.map((promo) => ({
      ...promo,
      business: businessMap.get(promo.businessId) ?? null,
    }));
  }

  async findOne(id: string) {
    const promo = await this.promotionModel.findById(id).exec();
    if (!promo) {
      throw new NotFoundException("Promoción no encontrada");
    }
    return promo;
  }

  async update(id: string, dto: UpdatePromotionDto, actor: Actor) {
    const promo = await this.promotionModel.findById(id).exec();
    if (!promo) {
      throw new NotFoundException("Promoción no encontrada");
    }
    const targetBusinessId = dto.businessId ?? promo.businessId;
    await this.assertBusinessOwner(targetBusinessId, actor);
    if (dto.branchId) {
      await this.assertBranchMatchesBusiness(dto.branchId, targetBusinessId);
    }
    const updated = await this.promotionModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException("Promoción no encontrada");
    }
    return updated;
  }

  async remove(id: string, actor: Actor) {
    const promo = await this.promotionModel.findById(id).exec();
    if (!promo) {
      throw new NotFoundException("Promoción no encontrada");
    }
    await this.assertBusinessOwner(promo.businessId, actor);
    const removed = await this.promotionModel.findByIdAndDelete(id).exec();
    if (!removed) {
      throw new NotFoundException("Promoción no encontrada");
    }
    return removed;
  }
}
