"use client";

import { createContext, useContext } from "react";
import { useRole } from "./role-context";
import { ROLE_PERMISSIONS } from "@/lib/permissions";

interface PermissionContextType {
  permissions: string[];
  hasPermission: (perm: string) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined
);

export function PermissionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { roles } = useRole();

  // 🔥 FIX #1 — Normalize roles into an array ALWAYS
  const normalizedRoles: string[] = Array.isArray(roles)
    ? roles
    : roles
    ? [roles]
    : [];

  // 🔥 FIX #2 — Safe flatten of permissions
  const permissions = normalizedRoles
    .flatMap((role) => ROLE_PERMISSIONS[role] || [])
    .map((p) => p.toLowerCase());

  const hasPermission = (perm: string) =>
    permissions.includes(perm.toLowerCase());

  console.log("ROLES FROM CONTEXT:", normalizedRoles);
console.log("PERMISSIONS:", permissions);


  return (
    <PermissionContext.Provider value={{ permissions, hasPermission }}>
      {children}
    </PermissionContext.Provider>
  );
}

export const usePermission = () => {
  const ctx = useContext(PermissionContext);
  if (!ctx)
    throw new Error("usePermission must be inside PermissionProvider");
  return ctx;
};
