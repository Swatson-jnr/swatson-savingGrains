"use client";

import { createContext, useContext } from "react";
import { useAuth } from "./auth-context";
// import { useAuth } from "./AuthContext";

interface RoleContextType {
  roles: string[];
  hasRole: (role: string) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const roles = user?.roles || [];

  const hasRole = (role: string) =>
    roles.map((r: any) => r.toLowerCase()).includes(role.toLowerCase());

  return (
    <RoleContext.Provider value={{ roles, hasRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
};
