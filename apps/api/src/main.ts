import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import express from "express";
import path from "node:path";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { createOriginChecker } from "./common/cors";
import { MongoExceptionFilter } from "./common/filters/mongo-exception.filter";

async function bootstrap() {
  // NOSONAR - top-level await is not available in CommonJS
  const app = await NestFactory.create(AppModule, {
    logger: ["log", "warn", "error"],
  });

  app.use(cookieParser());
  app.useGlobalFilters(new MongoExceptionFilter());
  app.setGlobalPrefix("api/v1");
  const isOriginAllowed = createOriginChecker(process.env.WEB_ORIGIN ?? "");
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      callback(null, isOriginAllowed(origin));
    },
    credentials: true,
  });
  if (process.env.NODE_ENV === "production") {
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidUnknownValues: false,
      }),
    );
  }

  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 API mispromos escuchando en puerto ${port}`);
}

const runBootstrap = async () => {
  try {
    await bootstrap();
  } catch (error) {
    console.error("Fallo al iniciar la API", error);
    process.exit(1);
  }
};

void runBootstrap();
