import { UserRole } from "@mispromos/shared";
import { type Request } from "express";

export type AuthPayload = {
  id: string;
  role: UserRole;
  email?: string;
};

export type AuthRequest = Request & { user?: AuthPayload };
