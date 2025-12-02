import { getUser } from "./getUser";
import { ROLE_PERMISSIONS } from "./permissions";

export function userHasPermission(permission: string) {
  const user = getUser();

  const allowedPermissions = ROLE_PERMISSIONS[user.role] || [];

  return allowedPermissions.includes(permission);
}


