import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserRole } from "@mispromos/shared";
import { Branch, type BranchDocument } from "./branch.schema";
import { CreateBranchDto } from "./dto/create-branch.dto";
import { UpdateBranchDto } from "./dto/update-branch.dto";
import { Business, type BusinessDocument } from "../business/business.schema";

type Actor = {
  id: string;
  role: UserRole;
};

@Injectable()
export class BranchService {
  constructor(
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

  async create(dto: CreateBranchDto, actor: Actor) {
    await this.assertBusinessOwner(dto.businessId, actor);
    const created = await this.branchModel.create(dto);
    return created;
  }

  async findAll(businessId?: string) {
    if (businessId) {
      return this.branchModel.find({ businessId }).exec();
    }
    return this.branchModel.find().exec();
  }

  async findOne(id: string) {
    const branch = await this.branchModel.findById(id).exec();
    if (!branch) {
      throw new NotFoundException("Sede no encontrada");
    }
    return branch;
  }

  async update(id: string, dto: UpdateBranchDto, actor: Actor) {
    const branch = await this.branchModel.findById(id).exec();
    if (!branch) {
      throw new NotFoundException("Sede no encontrada");
    }
    const targetBusinessId = dto.businessId ?? branch.businessId;
    await this.assertBusinessOwner(targetBusinessId, actor);
    const updated = await this.branchModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException("Sede no encontrada");
    }
    return updated;
  }

  async remove(id: string, actor: Actor) {
    const branch = await this.branchModel.findById(id).exec();
    if (!branch) {
      throw new NotFoundException("Sede no encontrada");
    }
    await this.assertBusinessOwner(branch.businessId, actor);
    const removed = await this.branchModel.findByIdAndDelete(id).exec();
    if (!removed) {
      throw new NotFoundException("Sede no encontrada");
    }
    return removed;
  }
}
