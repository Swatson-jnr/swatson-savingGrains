"use client";

import { userHasPermission } from "@/lib/checkPermissions";


export default function PermissionGuard({
  permission,
  children,
}: {
  permission: string;
  children: React.ReactNode;
}) {
  const allowed = userHasPermission(permission);

  if (!allowed) {
    return <div>You are not allowed to view this page.</div>;
  }

  return <>{children}</>;
}
