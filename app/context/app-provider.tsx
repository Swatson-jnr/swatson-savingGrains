"use client";

import { AuthProvider } from "./auth-context";
import { PermissionProvider } from "./permission-context";
import { RoleProvider } from "./role-context";


export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RoleProvider>
        <PermissionProvider>{children}</PermissionProvider>
      </RoleProvider>
    </AuthProvider>
  );
}
