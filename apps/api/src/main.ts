import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { MongoExceptionFilter } from "./common/filters/mongo-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["log", "warn", "error"],
  });

  app.use(cookieParser());
  app.useGlobalFilters(new MongoExceptionFilter());
  app.setGlobalPrefix("api/v1");
  const rawOrigins = process.env.WEB_ORIGIN ?? "";
  const allowedOrigins = rawOrigins
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);
  const defaultOrigins = [
    "https://mispromos-web.vercel.app",
    "https://mispromos-web-git-main-juansaldanas-projects.vercel.app",
  ];
  const originSet = new Set([...allowedOrigins, ...defaultOrigins]);
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      const normalized = origin.replace(/\/$/, "");
      if (originSet.size === 0) {
        callback(null, true);
        return;
      }
      const allowed =
        originSet.has(normalized) ||
        (/^https:\/\/mispromos-web(-git-[a-z0-9-]+)?-juansaldanas-projects\.vercel\.app$/.test(
          normalized
        ) &&
          Array.from(originSet).some((entry) => entry.includes("mispromos-web")));
      callback(null, allowed);
    },
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
    })
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 API mispromos escuchando en puerto ${port}`);
}

bootstrap();
