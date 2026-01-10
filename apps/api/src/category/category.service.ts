import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category, type CategoryDocument } from "./category.schema";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async create(dto: CreateCategoryDto) {
    return this.categoryModel.create(dto);
  }

  async findAll() {
    return this.categoryModel.find().sort({ name: 1 }).exec();
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException("Categoría no encontrada");
    }
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const updated = await this.categoryModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException("Categoría no encontrada");
    }
    return updated;
  }

  async remove(id: string) {
    const removed = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!removed) {
      throw new NotFoundException("Categoría no encontrada");
    }
    return removed;
  }
}
