import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import type { Request } from "express";
import path from "path";
import { promises as fs } from "fs";
import crypto from "crypto";
import sharp from "sharp";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_WIDTH = 1200;
const IMAGE_QUALITY = 80;

@Controller("uploads")
export class UploadController {
  @Post("promo-image")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (_, file, callback) => {
        if (!file.mimetype.startsWith("image/")) {
          callback(
            new BadRequestException("Solo se permiten imágenes."),
            false,
          );
          return;
        }
        callback(null, true);
      },
    }),
  )
  async uploadPromoImage(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Req() request: Request,
  ) {
    if (!file) {
      throw new BadRequestException("No se encontró imagen para subir.");
    }

    const uploadsRoot = path.join(process.cwd(), "uploads", "promos");
    await fs.mkdir(uploadsRoot, { recursive: true });

    const fileId = crypto.randomBytes(12).toString("hex");
    const filename = `${Date.now()}-${fileId}.webp`;
    const filePath = path.join(uploadsRoot, filename);

    await sharp(file.buffer)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: IMAGE_QUALITY })
      .toFile(filePath);

    const host = request.get("host");
    const protocol = request.protocol;
    const url = `${protocol}://${host}/uploads/promos/${filename}`;

    return { url };
  }
}
