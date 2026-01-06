import { IsEnum } from "class-validator";
import { UserRole } from "@mispromos/shared";

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  role!: UserRole;
}
