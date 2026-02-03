import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { City, type CityDocument } from "./city.schema";
import { CreateCityDto } from "./dto/create-city.dto";
import { UpdateCityDto } from "./dto/update-city.dto";
import { Business, type BusinessDocument } from "../business/business.schema";

@Injectable()
export class CityService {
  constructor(
    @InjectModel(City.name)
    private readonly cityModel: Model<CityDocument>,
    @InjectModel(Business.name)
    private readonly businessModel: Model<BusinessDocument>,
  ) {}

  async create(dto: CreateCityDto) {
    return this.cityModel.create(dto);
  }

  async findAll() {
    return this.cityModel.find().sort({ name: 1 }).exec();
  }

  async findWithBusinesses() {
    const businessCities = await this.businessModel
      .distinct("city", {
        approved: true,
        city: { $exists: true, $ne: "" },
      })
      .exec();
    if (businessCities.length === 0) {
      return [];
    }
    return this.cityModel
      .find({ name: { $in: businessCities } })
      .sort({ name: 1 })
      .exec();
  }

  async findOne(id: string) {
    const city = await this.cityModel.findById(id).exec();
    if (!city) {
      throw new NotFoundException("Ciudad no encontrada");
    }
    return city;
  }

  async update(id: string, dto: UpdateCityDto) {
    const updated = await this.cityModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException("Ciudad no encontrada");
    }
    return updated;
  }

  async remove(id: string) {
    const removed = await this.cityModel.findByIdAndDelete(id).exec();
    if (!removed) {
      throw new NotFoundException("Ciudad no encontrada");
    }
    return removed;
  }
}
