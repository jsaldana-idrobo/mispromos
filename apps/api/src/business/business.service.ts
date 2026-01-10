import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserRole } from "@mispromos/shared";
import { Business, type BusinessDocument } from "./business.schema";
import { CreateBusinessDto } from "./dto/create-business.dto";
import { UpdateBusinessDto } from "./dto/update-business.dto";

type Actor = {
  id: string;
  role: UserRole;
};

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(Business.name)
    private readonly businessModel: Model<BusinessDocument>,
  ) {}

  private assertOwner(business: BusinessDocument, actor: Actor) {
    if (actor.role === UserRole.ADMIN) {
      return;
    }
    if (business.ownerId !== actor.id) {
      throw new ForbiddenException("No autorizado");
    }
  }

  async create(dto: CreateBusinessDto, actor: Actor) {
    const created = await this.businessModel.create({
      ...dto,
      ownerId: actor.id,
    });
    return created;
  }

  async findAll() {
    return this.businessModel.find().exec();
  }

  async findByOwner(ownerId: string) {
    return this.businessModel.find({ ownerId }).exec();
  }

  async findOne(id: string) {
    const business = await this.businessModel.findById(id).exec();
    if (!business) {
      throw new NotFoundException("Negocio no encontrado");
    }
    return business;
  }

  async update(id: string, dto: UpdateBusinessDto, actor: Actor) {
    const business = await this.businessModel.findById(id).exec();
    if (!business) {
      throw new NotFoundException("Negocio no encontrado");
    }
    this.assertOwner(business, actor);
    const updated = await this.businessModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException("Negocio no encontrado");
    }
    return updated;
  }

  async remove(id: string, actor: Actor) {
    const business = await this.businessModel.findById(id).exec();
    if (!business) {
      throw new NotFoundException("Negocio no encontrado");
    }
    this.assertOwner(business, actor);
    const removed = await this.businessModel.findByIdAndDelete(id).exec();
    if (!removed) {
      throw new NotFoundException("Negocio no encontrado");
    }
    return removed;
  }
}
