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
import { User, type UserDocument } from "../auth/user.schema";
import { EmailService } from "../notifications/email.service";

type Actor = {
  id: string;
  role: UserRole;
};

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(Business.name)
    private readonly businessModel: Model<BusinessDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly emailService: EmailService,
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

  async updateApproval(id: string, approved: boolean) {
    const business = await this.businessModel.findById(id).exec();
    if (!business) {
      throw new NotFoundException("Negocio no encontrado");
    }

    const updated = await this.businessModel
      .findByIdAndUpdate(id, { approved }, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException("Negocio no encontrado");
    }

    if (approved && !business.approved) {
      const owner = await this.userModel
        .findById(business.ownerId)
        .select("+pendingPassword")
        .exec();
      if (owner?.email && owner.pendingPassword) {
        try {
          await this.emailService.sendApprovalEmail({
            to: owner.email,
            businessName: business.name,
            password: owner.pendingPassword,
          });
          await this.userModel
            .findByIdAndUpdate(owner.id, { $unset: { pendingPassword: 1 } })
            .exec();
        } catch {
          // avoid blocking approval on email failures
        }
      }
    }

    return updated;
  }
}
