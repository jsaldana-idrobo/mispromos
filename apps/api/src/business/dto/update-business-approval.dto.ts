import { IsBoolean } from "class-validator";

export class UpdateBusinessApprovalDto {
  @IsBoolean()
  approved!: boolean;
}
