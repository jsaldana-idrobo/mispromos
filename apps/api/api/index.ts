import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import express, { type Request, type Response } from "express";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { AppModule } from "../src/app.module";
import { MongoExceptionFilter } from "../src/common/filters/mongo-exception.filter";

let cachedServer: express.Express | null = null;
let cachedInit: Promise<express.Express> | null = null;

const bootstrap = async (): Promise<express.Express> => {
  const expressApp = express();
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.get("/", (_, res: Response) => {
    const port = process.env.PORT ?? "3000";
    res.json({
      status: "ok",
      service: "api",
      message: `mispromos API running on port ${port}`,
    });
  });
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter, {
    logger: ["log", "warn", "error"],
    bodyParser: false,
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
  return expressApp;
};

export default async function handler(req: Request, res: Response) {
  if (!cachedServer) {
    cachedInit = cachedInit ?? bootstrap();
    cachedServer = await cachedInit;
  }
  return cachedServer(req, res);
}
