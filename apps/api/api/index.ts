import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";
import serverless from "serverless-http";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { AppModule } from "../src/app.module";
import { MongoExceptionFilter } from "../src/common/filters/mongo-exception.filter";

let cachedHandler: ReturnType<typeof serverless> | null = null;

const bootstrap = async () => {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter, {
    logger: ["log", "warn", "error"],
  });

  app.use(cookieParser());
  app.useGlobalFilters(new MongoExceptionFilter());
  app.setGlobalPrefix("api/v1");
  const webOrigin = process.env.WEB_ORIGIN ?? "http://localhost:4321";
  app.enableCors({
    origin: webOrigin,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
    })
  );

  await app.init();
  return serverless(expressApp);
};

export default async function handler(...args: Parameters<ReturnType<typeof serverless>>) {
  if (!cachedHandler) {
    cachedHandler = await bootstrap();
  }
  return cachedHandler(...args);
}
