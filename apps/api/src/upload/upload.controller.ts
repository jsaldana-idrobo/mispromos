import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { v2 as cloudinary } from "cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_WIDTH = 1200;

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const uploadFolder = process.env.CLOUDINARY_FOLDER ?? "mispromos/promos";

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

@Controller("uploads")
export class UploadController {
  @Post("promo-image")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE, files: 1 },
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
  ) {
    if (!file) {
      throw new BadRequestException("No se encontró imagen para subir.");
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException("La imagen supera el tamaño permitido.");
    }
    if (!cloudName || !apiKey || !apiSecret) {
      throw new BadRequestException("Cloudinary no está configurado.");
    }

    const url = await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: uploadFolder,
          resource_type: "image",
          transformation: [
            { width: MAX_WIDTH, crop: "limit" },
            { quality: "auto:good", fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error || !result?.secure_url) {
            const cause =
              error instanceof Error
                ? error
                : new Error("No se pudo obtener la URL de la imagen.");
            reject(cause);
            return;
          }
          resolve(result.secure_url);
        },
      );
      stream.end(file.buffer);
    });

    return { url };
  }
}
