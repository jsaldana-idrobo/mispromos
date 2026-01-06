import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";

const DUPLICATE_KEY = 11000;

type MongoError = {
  code?: number;
  keyValue?: Record<string, string>;
};

type ExpressLikeResponse = {
  status: (code: number) => ExpressLikeResponse;
  json: (body: unknown) => unknown;
};

const isExpressLikeResponse = (value: unknown): value is ExpressLikeResponse => {
  if (!value || typeof value !== "object") return false;
  const response = value as Record<string, unknown>;
  return typeof response.status === "function" && typeof response.json === "function";
};

@Catch()
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<unknown>();

    const mongoError = exception as MongoError;
    if (mongoError.code === DUPLICATE_KEY) {
      const field = mongoError.keyValue ? Object.keys(mongoError.keyValue)[0] : "campo";
      if (isExpressLikeResponse(response)) {
        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: `El ${field} ya existe`,
        });
        return;
      }
      return;
    }

    throw exception;
  }
}
