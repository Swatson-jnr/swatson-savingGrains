import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

export interface AuthenticatedUser {
  userId: string;
  email: string;
  roles: string[];
  firstName?: string;
  lastName?: string;
}

/**
 * Get authenticated user from request
 */
export async function getAuthenticatedUser(
  req: NextRequest
): Promise<AuthenticatedUser | null> {
  try {
    // Get token from cookie or Authorization header
    const token =
      req.cookies.get("auth-token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return null;
    }

    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET);

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      roles: payload.roles as string[],
      firstName: payload.firstName as string | undefined,
      lastName: payload.lastName as string | undefined,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

/**
 * Check if user has any of the specified roles
 */
export function hasRole(user: AuthenticatedUser | null, roles: string[]): boolean {
  if (!user) return false;
  return user.roles.some((role) => roles.includes(role));
}

/**
 * Check if user is admin (super-admin or admin)
 */
export function isAdmin(user: AuthenticatedUser | null): boolean {
  return hasRole(user, ["super-admin", "admin"]);
}

/**
 * Require authentication - returns error response if not authenticated
 */
export async function requireAuth(
  req: NextRequest
): Promise<{ user: AuthenticatedUser } | NextResponse> {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized - Please login" },
      { status: 401 }
    );
  }

  return { user };
}

/**
 * Require admin role - returns error response if not admin
 */
export async function requireAdmin(
  req: NextRequest
): Promise<{ user: AuthenticatedUser } | NextResponse> {
  const authResult = await requireAuth(req);

  // If requireAuth returned an error response, return it
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  if (!isAdmin(user)) {
    return NextResponse.json(
      { error: "Forbidden - Admin access required" },
      { status: 403 }
    );
  }

  return { user };
}

/**
 * Require specific roles - returns error response if user doesn't have required role
 */
export async function requireRoles(
  req: NextRequest,
  roles: string[]
): Promise<{ user: AuthenticatedUser } | NextResponse> {
  const authResult = await requireAuth(req);

  // If requireAuth returned an error response, return it
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  if (!hasRole(user, roles)) {
    return NextResponse.json(
      { error: `Forbidden - Required roles: ${roles.join(", ")}` },
      { status: 403 }
    );
  }

  return { user };
}