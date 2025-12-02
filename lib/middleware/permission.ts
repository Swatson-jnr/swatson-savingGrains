// lib/middleware/permission.ts
import { ROLE_PERMISSIONS } from "@/lib/permissions"; // your role-permission map
// import { hasRole } from "./authMiddleware";

/**
 * Check if the user has a specific permission
 */
export function hasPermission(userRoles: string[], permission: string): boolean {
  for (const role of userRoles) {
    const allowed = ROLE_PERMISSIONS[role] || [];
    if (allowed.includes(permission)) return true;
  }
  return false;
}

export function collectPermissions(roles: string[]) {
  const all = new Set<string>();

  roles.forEach(role => {
    (ROLE_PERMISSIONS[role] || []).forEach(p => all.add(p));
  });

  return Array.from(all);
}