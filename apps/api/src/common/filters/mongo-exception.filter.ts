import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { type Response } from "express";

const DUPLICATE_KEY = 11000;

type MongoError = {
  code?: number;
  keyValue?: Record<string, string>;
};

@Catch()
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const mongoError = exception as MongoError;
    if (mongoError.code === DUPLICATE_KEY) {
      const field = mongoError.keyValue ? Object.keys(mongoError.keyValue)[0] : "campo";
      response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: `El ${field} ya existe`,
      });
      return;
    }

    throw exception;
  }
}
