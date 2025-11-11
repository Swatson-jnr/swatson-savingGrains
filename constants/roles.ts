// Centralized role definitions
// Keep in sync with lib/models/User.ts enum values

export const adminRoles: string[] = ["super-admin", "backoffice-admin"]

export const allRoles: string[] = [
  ...adminRoles,
  "account-manager",
  "paymaster",
  "stock-manager",
  "field-agent",
]

const Roles = {
  adminRoles,
  allRoles,
}

export default Roles

