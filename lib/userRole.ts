import apiClient from "./axios";

interface User {
  _id: string;
  first_name?: string;
  last_name?: string;
  roles?: string[];
}

/**
 * Fetch all users and return just the FIRST role of a specific user by ID.
 * @param userId - The ID of the user to find
 * @returns First role or null if user not found or has no roles
 */
export async function getUserFirstRole(userId: string): Promise<string | null> {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found");

    const response = await apiClient.get<User[]>("users/all-users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const users = response.data;
    const foundUser = users.find((u) => String(u._id) === userId);

    if (!foundUser || !foundUser.roles || foundUser.roles.length === 0) {
      return null;
    }

    return foundUser.roles[0]; // Returns just the first role
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

/**
 * Fetch all users and return "super_admin" if it exists, otherwise return the first role.
 * @param userId - The ID of the user to find
 * @returns "super_admin" if exists, otherwise first role, or null
 */
export async function getUserPrimaryRole(
  userId: string
): Promise<string | null> {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found");

    const response = await apiClient.get<User[]>("users/all-users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const users = response.data;
    const foundUser = users.find((u) => String(u._id) === userId);

    if (!foundUser || !foundUser.roles || foundUser.roles.length === 0) {
      return null;
    }

    // Check if super_admin exists in the roles array
    if (foundUser.roles.includes("super_admin")) {
      return "super_admin";
    }

    // Otherwise return the first role
    return foundUser.roles[0];
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

/**
 * Fetch all users and return ALL roles but display only the first one in UI.
 * @param userId - The ID of the user to find
 * @returns Object with all roles and the primary role to display
 */
export async function getUserRolesWithPrimary(
  userId: string
): Promise<{ allRoles: string[]; primaryRole: string } | null> {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found");

    const response = await apiClient.get<User[]>("users/all-users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const users = response.data;
    const foundUser = users.find((u) => String(u._id) === userId);

    if (!foundUser || !foundUser.roles || foundUser.roles.length === 0) {
      return null;
    }

    const allRoles = foundUser.roles;

    // Prioritize super_admin if it exists, otherwise use first role
    const primaryRole = allRoles.includes("Super-admin")
      ? "Admin"
      : allRoles[0];

    return {
      allRoles,
      primaryRole,
    };
  } catch (error) {
    console.error("Error fetching user roles:", error);
    return null;
  }
}

/**
 * Original function - returns all roles
 */
export async function getUserRolesById(
  userId: string
): Promise<string[] | null> {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found");

    const response = await apiClient.get<User[]>("users/all-users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const users = response.data;
    const foundUser = users.find((u) => String(u._id) === userId);

    if (!foundUser) return null;
    if (!foundUser.roles) return null;
    const primaryRole = foundUser.roles[0];

    // return foundUser.roles || [];
    return primaryRole ? [primaryRole] : null;
  } catch (error) {
    console.error("Error fetching user roles:", error);
    return null;
  }
}
