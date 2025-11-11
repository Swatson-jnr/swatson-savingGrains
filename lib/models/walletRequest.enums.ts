/**
 * TypeScript enum for wallet request statuses
 */
export enum WalletRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  DECLINED = "declined",
  SUCCESSFUL = "successful",
}

/**
 * Helper function to convert enum to UI-friendly display string
 */
export function getStatusDisplayString(status: WalletRequestStatus): string {
  switch (status) {
    case WalletRequestStatus.PENDING:
      return "Pending";
    case WalletRequestStatus.APPROVED:
      return "Approved";
    case WalletRequestStatus.DECLINED:
      return "Declined";
    case WalletRequestStatus.SUCCESSFUL:
      return "Successful";
    default:
      return "Unknown";
  }
}

/**
 * Helper function to get all valid status enum values as an array
 */
export function getAllStatusValues(): WalletRequestStatus[] {
  return Object.values(WalletRequestStatus);
}

/**
 * Helper function to check if a string is a valid status
 */
export function isValidStatus(status: string): status is WalletRequestStatus {
  return Object.values(WalletRequestStatus).includes(
    status as WalletRequestStatus
  );
}

/**
 * Helper function to convert string to enum (with validation)
 */
export function parseStatus(status: string): WalletRequestStatus | null {
  if (isValidStatus(status)) {
    return status as WalletRequestStatus;
  }
  return null;
}
