import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  health() {
    return {
      status: "ok",
      service: "api",
      build: "redeploy-1",
      timestamp: new Date().toISOString(),
    };
  }
}
