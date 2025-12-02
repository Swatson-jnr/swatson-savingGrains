import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/middleware/authMiddleware";
import { ROLE_PERMISSIONS } from "@/lib/permissions";
// import { ROLE_PERMISSIONS } from "@/permissions/roles";

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);

  if (!auth.user) {
    return NextResponse.json(
      { error: auth.error, permissions: [] },
      { status: auth.status }
    );
  }

  const userRoles = auth.user.roles || [];

  // Collect all permissions for the user's roles
  const permissions = Array.from(
    new Set(userRoles.flatMap((role) => ROLE_PERMISSIONS[role] || []))
  );

  return NextResponse.json({
    id: auth.user.id,
    phone_number: auth.user.phone_number,
    roles: userRoles,
    permissions,
  });
}
