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
    private readonly businessModel: Model<BusinessDocument>,
  ) {}

  private async getBusinessForActor(businessId: string, actor: Actor) {
    const business = await this.businessModel
      .findById(businessId)
      .select("_id name slug categories instagram website ownerId")
      .lean()
      .exec();
    if (!business) {
      throw new NotFoundException("Negocio no encontrado");
    }
    if (actor.role !== UserRole.ADMIN && business.ownerId !== actor.id) {
      throw new ForbiddenException("No autorizado");
    }
    return business;
  }

  private buildBusinessSnapshotFrom(business: {
    name: string;
    slug: string;
    categories?: string[];
    instagram?: string;
    website?: string;
  }) {
    return {
      businessName: business.name,
      businessSlug: business.slug,
      businessCategories: business.categories ?? [],
      businessInstagram: business.instagram,
      businessWebsite: business.website,
    };
  }

  private async assertBusinessOwner(businessId: string, actor: Actor) {
    if (actor.role === UserRole.ADMIN) {
      return;
    }
    const business = await this.businessModel
      .findById(businessId)
      .select("ownerId")
      .exec();
    if (!business) {
      throw new NotFoundException("Negocio no encontrado");
    }
    if (business.ownerId !== actor.id) {
      throw new ForbiddenException("No autorizado");
    }
  }

  private async assertBranchMatchesBusiness(
    branchId: string,
    businessId: string,
  ) {
    const branch = await this.branchModel
      .findById(branchId)
      .select("businessId")
      .exec();
    if (!branch) {
      throw new NotFoundException("Sede no encontrada");
    }
    if (branch.businessId !== businessId) {
      throw new BadRequestException("La sede no pertenece al negocio");
    }
  }

  async create(dto: CreatePromotionDto, actor: Actor) {
    const business = await this.getBusinessForActor(dto.businessId, actor);
    if (dto.featured !== undefined && actor.role !== UserRole.ADMIN) {
      throw new ForbiddenException("No autorizado");
    }
    if (dto.branchId) {
      await this.assertBranchMatchesBusiness(dto.branchId, dto.businessId);
    }
    const businessSnapshot = this.buildBusinessSnapshotFrom(business);
    const created = await this.promotionModel.create({
      ...dto,
      ...businessSnapshot,
    });
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
    const zonedDate = new Date(
      Date.UTC(year, month - 1, day, hour, minute, second),
    );
    return {
      day: this.getDayOfWeekByIndex(zonedDate.getUTCDay()),
      time: `${values.hour}:${values.minute}`,
    };
  }

  private escapeRegex(input: string) {
    return input.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\\$&`);
  }

  private async buildBranchFilter(city?: string) {
    if (!city) {
      return {};
    }
    const branchIds = await this.branchModel
      .find({ city })
      .select("_id")
      .lean()
      .exec();

    const branchIdStrings = branchIds.map((branch) => String(branch._id));

    return branchIdStrings.length > 0
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

  private async buildBusinessFilter(category?: string, businessType?: string) {
    if (!category && !businessType) {
      return {};
    }
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
    return businessIds.length > 0
      ? { businessId: { $in: businessIds } }
      : { businessId: "__none__" };
  }

  private buildFeaturedFilter(featured?: boolean) {
    if (featured === true) {
      return { featured: true };
    }
    if (featured === false) {
      return {
        $or: [
          { featured: false },
          { featured: { $exists: false } },
          { featured: null },
        ],
      };
    }
    return {};
  }

  private buildQueryFilter(q?: string) {
    if (!q) {
      return {};
    }
    const escaped = this.escapeRegex(q);
    return {
      $or: [
        { title: { $regex: escaped, $options: "i" } },
        { description: { $regex: escaped, $options: "i" } },
      ],
    };
  }

  private buildDateFilter(now: Date) {
    return {
      $and: [
        {
          $or: [
            { startDate: { $lte: now } },
            { startDate: null },
            { startDate: { $exists: false } },
          ],
        },
        {
          $or: [
            { endDate: { $gte: now } },
            { endDate: null },
            { endDate: { $exists: false } },
          ],
        },
      ],
    };
  }

  private buildTimeFilter(time: string) {
    return {
      $and: [
        {
          $or: [
            { startHour: { $lte: time } },
            { startHour: null },
            { startHour: { $exists: false } },
          ],
        },
        {
          $or: [
            { endHour: { $gte: time } },
            { endHour: null },
            { endHour: { $exists: false } },
          ],
        },
      ],
    };
  }

  private getPromoListProjection() {
    return {
      _id: 1,
      businessId: 1,
      branchId: 1,
      title: 1,
      description: 1,
      promoType: 1,
      value: 1,
      imageUrl: 1,
      startDate: 1,
      endDate: 1,
      daysOfWeek: 1,
      startHour: 1,
      endHour: 1,
      featured: 1,
      businessName: 1,
      businessSlug: 1,
      businessCategories: 1,
      businessInstagram: 1,
      businessWebsite: 1,
    };
  }

  private async buildActiveBaseFilter(params: {
    city?: string;
    at?: string;
    promoType?: string;
    category?: string;
    businessType?: string;
    q?: string;
  }) {
    const { city, at, promoType, category, businessType, q } = params;
    const now = at ? new Date(at) : new Date();
    if (Number.isNaN(now.valueOf())) {
      throw new BadRequestException("Formato de fecha inválido");
    }

    const { day, time } = this.getTimePartsInZone(now, "America/Bogota");

    const [branchFilter, businessFilter] = await Promise.all([
      this.buildBranchFilter(city),
      this.buildBusinessFilter(category, businessType),
    ]);
    const promoTypeFilter = promoType ? { promoType } : {};
    const queryFilter = this.buildQueryFilter(q);

    const dateFilter = this.buildDateFilter(now);
    const timeFilter = this.buildTimeFilter(time);

    const baseFilter = {
      ...branchFilter,
      ...businessFilter,
      ...promoTypeFilter,
      ...queryFilter,
      active: true,
      ...dateFilter,
      ...timeFilter,
      daysOfWeek: day,
    };

    return { baseFilter };
  }

  private async buildBusinessMap(
    promos: Array<{
      businessId?: string;
      businessName?: string;
    }>,
  ) {
    const missingIds = new Set<string>();
    for (const promo of promos) {
      if (!promo.businessName && promo.businessId) {
        missingIds.add(String(promo.businessId));
      }
    }
    if (missingIds.size === 0) {
      return new Map<
        string,
        {
          _id: string;
          name: string;
          slug: string;
          categories?: string[];
          instagram?: string;
          website?: string;
        }
      >();
    }
    const businesses = await this.businessModel
      .find({ _id: { $in: Array.from(missingIds) } })
      .select("_id name slug categories instagram website")
      .lean()
      .exec();
    return new Map(
      businesses.map((business) => [
        String(business._id),
        {
          _id: String(business._id),
          name: business.name,
          slug: business.slug,
          categories: business.categories,
          instagram: business.instagram,
          website: business.website,
        },
      ]),
    );
  }

  private buildBusinessSummary(
    promo: {
      businessId?: string;
      businessName?: string;
      businessSlug?: string;
      businessCategories?: string[];
      businessInstagram?: string;
      businessWebsite?: string;
    },
    businessMap: Map<
      string,
      {
        _id: string;
        name: string;
        slug: string;
        categories?: string[];
        instagram?: string;
        website?: string;
      }
    >,
  ) {
    if (promo.businessName) {
      return {
        _id: promo.businessId ?? "",
        name: promo.businessName,
        slug: promo.businessSlug ?? "",
        categories: promo.businessCategories ?? [],
        instagram: promo.businessInstagram,
        website: promo.businessWebsite,
      };
    }
    if (!promo.businessId) {
      return null;
    }
    return businessMap.get(String(promo.businessId)) ?? null;
  }

  private stripBusinessSnapshot<
    T extends {
      businessName?: string;
      businessSlug?: string;
      businessCategories?: string[];
      businessInstagram?: string;
      businessWebsite?: string;
    },
  >(promo: T, business: unknown) {
    const {
      businessName,
      businessSlug,
      businessCategories,
      businessInstagram,
      businessWebsite,
      ...rest
    } = promo;
    return { ...rest, business };
  }

  async findActiveByCity(params: {
    city?: string;
    at?: string;
    promoType?: string;
    category?: string;
    businessType?: string;
    featured?: boolean;
    q?: string;
    offset?: number;
    limit?: number;
  }) {
    const { featured, offset, limit } = params;
    const { baseFilter } = await this.buildActiveBaseFilter(params);
    const featuredFilter = this.buildFeaturedFilter(featured);
    const filter = {
      ...baseFilter,
      ...featuredFilter,
    };

    const safeLimit = Math.min(Math.max(limit ?? 10, 1), 50);
    const safeOffset = Math.max(offset ?? 0, 0);

    const [total, promos] = await Promise.all([
      this.promotionModel.countDocuments(filter).exec(),
      this.promotionModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(safeOffset)
        .limit(safeLimit)
        .lean()
        .exec(),
    ]);

    const businessMap = await this.buildBusinessMap(promos);

    return {
      items: promos.map((promo) =>
        this.stripBusinessSnapshot(
          promo,
          this.buildBusinessSummary(promo, businessMap),
        ),
      ),
      total,
    };
  }

  async findActiveFeed(params: {
    city?: string;
    at?: string;
    promoType?: string;
    category?: string;
    businessType?: string;
    q?: string;
    offset?: number;
    limit?: number;
    includeFeatured?: boolean;
    featuredLimit?: number;
  }) {
    const { offset, limit, includeFeatured, featuredLimit } = params;
    const { baseFilter } = await this.buildActiveBaseFilter(params);
    const safeLimit = Math.min(Math.max(limit ?? 10, 1), 50);
    const safeOffset = Math.max(offset ?? 0, 0);
    const safeFeaturedLimit = Math.min(Math.max(featuredLimit ?? 4, 1), 10);
    const projection = this.getPromoListProjection();
    const regularFilter = {
      ...baseFilter,
      ...this.buildFeaturedFilter(false),
    };
    const featuredFilter = {
      ...baseFilter,
      ...this.buildFeaturedFilter(true),
    };

    const regularCountPromise = this.promotionModel
      .countDocuments(regularFilter)
      .exec();
    const regularItemsPromise = this.promotionModel
      .find(regularFilter)
      .sort({ createdAt: -1 })
      .skip(safeOffset)
      .limit(safeLimit)
      .select(projection)
      .lean()
      .exec();

    const featuredRequested = includeFeatured ?? true;
    const featuredCountPromise = featuredRequested
      ? this.promotionModel.countDocuments(featuredFilter).exec()
      : Promise.resolve(0);
    const featuredItemsPromise = featuredRequested
      ? this.promotionModel
          .find(featuredFilter)
          .sort({ createdAt: -1 })
          .limit(safeFeaturedLimit)
          .select(projection)
          .lean()
          .exec()
      : Promise.resolve([]);

    const [totalRegular, regularItems, totalFeatured, featuredItems] =
      await Promise.all([
        regularCountPromise,
        regularItemsPromise,
        featuredCountPromise,
        featuredItemsPromise,
      ]);

    const combined = featuredRequested
      ? [...regularItems, ...featuredItems]
      : regularItems;
    const businessMap = await this.buildBusinessMap(combined);

    const items = regularItems.map((promo) =>
      this.stripBusinessSnapshot(
        promo,
        this.buildBusinessSummary(promo, businessMap),
      ),
    );
    const featured = featuredItems.map((promo) =>
      this.stripBusinessSnapshot(
        promo,
        this.buildBusinessSummary(promo, businessMap),
      ),
    );

    return {
      items,
      featured,
      totalRegular,
      totalFeatured,
      total: totalRegular + totalFeatured,
    };
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
    if (dto.featured !== undefined && actor.role !== UserRole.ADMIN) {
      throw new ForbiddenException("No autorizado");
    }
    const targetBusinessId = dto.businessId ?? promo.businessId;
    const business = await this.getBusinessForActor(targetBusinessId, actor);
    if (dto.branchId) {
      await this.assertBranchMatchesBusiness(dto.branchId, targetBusinessId);
    }
    const businessSnapshot = this.buildBusinessSnapshotFrom(business);
    const updated = await this.promotionModel
      .findByIdAndUpdate(id, { ...dto, ...businessSnapshot }, { new: true })
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
