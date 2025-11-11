/**
 * Zod validation schemas for wallet top-up request endpoints
 * Phase 0a: Request body validation
 */

import { z } from "zod";
import { WalletRequestStatus } from "@/lib/models/walletRequest.enums";

/**
 * Schema for creating a new wallet top-up request (POST)
 * Payment method is optional - will be selected by admin during approval
 */
export const CreateWalletRequestSchema = z.object({
  amount: z
    .number({ message: "Amount must be a positive number" })
    .positive("Amount must be a positive number")
    .max(1000000, "Amount cannot exceed 1,000,000"),
  payment_method: z
    .string()
    .refine(
      (val) =>
        !val || ["Cash Payment", "Mobile Money", "Bank Transfer"].includes(val),
      "Invalid payment method"
    )
    .optional()
    .nullable(),
  reason: z
    .string()
    .min(1, "Reason is required")
    .max(500, "Reason cannot exceed 500 characters")
    .optional(),
  // Payment details are NOT included in creation - added during approval
});

export type CreateWalletRequestInput = z.infer<
  typeof CreateWalletRequestSchema
>;

/**
 * Schema for updating wallet request details (PUT)
 * Allows updating payment method, provider, phone, bank details
 */
export const UpdateWalletRequestSchema = z.object({
  payment_method: z.enum(["mobile_money", "bank_transfer", "cash"]).optional(),
  provider: z.string().min(1).max(50).optional(),
  phone_number: z.string().min(1).max(20).optional(),
  bank_name: z.string().min(1).max(100).optional(),
  branch_name: z.string().min(1).max(100).optional(),
});

export type UpdateWalletRequestInput = z.infer<
  typeof UpdateWalletRequestSchema
>;

/**
 * Schema for approving or declining a wallet request (PUT with status)
 * Validates the status change and required fields
 */
export const ApproveDeclineSchema = z
  .object({
    status: z.enum(WalletRequestStatus),
    payment_method: z
      .enum(["mobile_money", "bank_transfer", "cash"])
      .optional(),
    provider: z.string().min(1).max(50).optional(),
    phone_number: z.string().min(1).max(20).optional(),
    bank_name: z.string().min(1).max(100).optional(),
    branch_name: z.string().min(1).max(100).optional(),
    rejectionReason: z.string().min(1).max(500).optional(),
  })
  .strict() // Reject any extra fields
  .superRefine((data, ctx) => {
    // If status is declined, rejectionReason is required
    if (data.status === WalletRequestStatus.DECLINED && !data.rejectionReason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "rejectionReason is required when declining a request",
        path: ["rejectionReason"],
      });
    }

    // If status is declined, rejectionReason must have min 1 char
    if (
      data.status === WalletRequestStatus.DECLINED &&
      data.rejectionReason &&
      data.rejectionReason.length < 1
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "rejectionReason cannot be empty",
        path: ["rejectionReason"],
      });
    }

    // If payment_method is mobile_money, provider and phone_number required
    if (data.payment_method === "mobile_money") {
      if (!data.provider) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Provider is required for Mobile Money payment method",
          path: ["provider"],
        });
      }
      if (!data.phone_number) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number is required for Mobile Money payment method",
          path: ["phone_number"],
        });
      }
    }

    // If payment_method is bank_transfer, bank_name and branch_name required
    if (data.payment_method === "bank_transfer") {
      if (!data.bank_name && !data.branch_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Bank name and branch name are required for Bank Transfer payment method",
          path: ["bank_name"],
        });
      } else if (!data.bank_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Bank name is required for bank_transfer payment method",
          path: ["bank_name"],
        });
      } else if (!data.branch_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Branch name is required for bank_transfer payment method",
          path: ["branch_name"],
        });
      }
    }
  });

export type ApproveDeclineInput = z.infer<typeof ApproveDeclineSchema>;

/**
 * Schema for confirming receipt of approved wallet request (PUT)
 * Empty body allowed - just need authentication
 */
export const ConfirmReceiptSchema = z.object({}).strict(); // Empty body, reject any fields

export type ConfirmReceiptInput = z.infer<typeof ConfirmReceiptSchema>;

/**
 * Schema for query parameters when listing wallet requests (GET)
 * Phase 0b: Query parameter validation
 */
export const ListWalletRequestsQuerySchema = z
  .object({
    // Pagination
    page: z
      .string()
      .optional()
      .refine(
        (val) => !val || !isNaN(Number(val)),
        "Page must be a valid number"
      )
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .pipe(z.number().int().positive("Page must be a positive integer")),
    limit: z
      .string()
      .optional()
      .refine(
        (val) => !val || !isNaN(Number(val)),
        "Limit must be a valid number"
      )
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .pipe(
        z
          .number()
          .int()
          .positive("Limit must be a positive integer")
          .max(100, "Limit cannot exceed 100")
      ),

    // Sorting
    sortBy: z.enum(["createdAt", "amount"]).optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),

    // Filters
    status: z
      .string()
      .optional()
      .transform((val) => (val ? val.toLowerCase() : undefined))
      .pipe(
        z
          .enum(Object.values(WalletRequestStatus) as [string, ...string[]])
          .optional()
      ),
    paymentMethod: z.string().min(1).max(50).optional(),
    userType: z.enum(["all", "myself", "field-agents"]).optional(),

    // Date filters
    fromDate: z
      .string()
      .optional()
      .refine(
        (val) => !val || !isNaN(new Date(val).getTime()),
        "Invalid fromDate format. Use ISO 8601 format (e.g., 2025-01-01)"
      ),
    toDate: z
      .string()
      .optional()
      .refine(
        (val) => !val || !isNaN(new Date(val).getTime()),
        "Invalid toDate format. Use ISO 8601 format (e.g., 2025-01-01)"
      ),
  })
  .strict() // Reject any extra query parameters
  .refine(
    (data) => {
      // If both fromDate and toDate are provided, fromDate must be <= toDate
      if (data.fromDate && data.toDate) {
        const from = new Date(data.fromDate);
        const to = new Date(data.toDate);
        return from <= to;
      }
      return true;
    },
    {
      message: "fromDate cannot be greater than toDate",
      path: ["fromDate"],
    }
  );

export type ListWalletRequestsQuery = z.infer<
  typeof ListWalletRequestsQuerySchema
>;
