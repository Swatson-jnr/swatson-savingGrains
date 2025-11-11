import apiClient from "./axios";

interface User {
  _id: string;
  first_name?: string;
  last_name?: string;
  roles?: string[];
}

/**
 * Fetch all users and return the role(s) of a specific user by ID.
 * @param userId - The ID of the user to find
 * @returns Array of roles or null if user not found
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

    return foundUser.roles || [];
  } catch (error) {
    console.error("Error fetching user roles:", error);
    return null;
  }
}
