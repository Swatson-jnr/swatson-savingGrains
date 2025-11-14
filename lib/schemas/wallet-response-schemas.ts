/**
 * Zod validation schemas for wallet top-up request API responses
 * Phase 0b.2: Response validation
 *
 * These schemas validate that the API returns correctly structured data
 * to catch data integrity issues before they reach the client
 */

import { z } from "zod";
import { WalletRequestStatus } from "@/lib/models/walletRequest.enums";

/**
 * Schema for a single wallet request response (database model)
 * Used when returning raw wallet request documents
 */
export const WalletRequestResponseSchema = z.object({
  _id: z.any().transform((val) => {
    if (typeof val === "string") return val;
    if (val && typeof val.toString === "function") return val.toString();
    return String(val);
  }),
  user: z.any().transform((val) => {
    if (typeof val === "string") return val;
    if (val && typeof val.toString === "function") return val.toString();
    return String(val);
  }),
  amount: z.number().positive("Amount must be positive"),
  // payment_method: z
  //   .enum(["cash", "mobile_money", "bank_transfer"])
  //   .nullable()
  //   .optional(),
  payment_method: z
    .enum(["Cash Payment", "Mobile Money", "Bank Transfer"]) // Match database enum
    .nullable()
    .optional(),
  provider: z.string().optional(),
  phone_number: z.string().optional(),
  bank_name: z.string().optional(),
  branch_name: z.string().optional(),
  reason: z.string().optional(),
  status: z
    .string()
    .transform((val) => val.toLowerCase())
    .pipe(z.enum(Object.values(WalletRequestStatus) as [string, ...string[]])),
  reviewed_by: z
    .any()
    .transform((val) => {
      if (!val) return undefined;
      if (typeof val === "string") return val;
      if (typeof val.toString === "function") return val.toString();
      return String(val);
    })
    .optional(),
  reviewed_at: z
    .union([z.date(), z.string()])
    .transform((val) => (val instanceof Date ? val.toISOString() : val))
    .optional(),
  rejectionReason: z.string().optional(),
  confirmed_at: z
    .union([z.date(), z.string()])
    .transform((val) => (val instanceof Date ? val.toISOString() : val))
    .optional(),
  createdAt: z
    .union([z.date(), z.string()])
    .transform((val) => (val instanceof Date ? val.toISOString() : val))
    .optional(),
  updatedAt: z
    .union([z.date(), z.string()])
    .transform((val) => (val instanceof Date ? val.toISOString() : val))
    .optional(),
});

export type WalletRequestResponse = z.infer<typeof WalletRequestResponseSchema>;

/**
 * Schema for transformed wallet request (frontend format)
 * Used in GET /api/wallet-topup-request list endpoint
 */
export const TransformedWalletRequestSchema = z.object({
  id: z.string(),
  label: z.string(),
  requestedDate: z.string(), // ISO 8601 date string
  user: z.string(),
  requesterName: z.string(),
  amount: z.number().positive("Amount must be positive"),
  status: z.string(),
  currency: z.string(),
  paymentType: z
    .enum(["cash", "mobile_money", "bank_transfer"])
    .nullable()
    .optional(),
  reason: z.string().optional(),
  approvedDate: z.string().optional().nullable(), // ISO 8601 date string or null
});

export type TransformedWalletRequest = z.infer<
  typeof TransformedWalletRequestSchema
>;

/**
 * Schema for pagination metadata
 */
export const PaginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive().max(100),
  totalCount: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

export type Pagination = z.infer<typeof PaginationSchema>;

/**
 * Schema for paginated list response
 * Used in GET /api/wallet-topup-request
 */
export const ListWalletRequestsResponseSchema = z.object({
  data: z.array(TransformedWalletRequestSchema),
  pagination: PaginationSchema,
});

export type ListWalletRequestsResponse = z.infer<
  typeof ListWalletRequestsResponseSchema
>;

/**
 * Schema for single wallet request response (POST, PUT)
 * Wraps the wallet request in an object with optional note
 */
export const SingleWalletRequestResponseSchema = z.object({
  walletRequest: WalletRequestResponseSchema,
  note: z.string().optional(), // Optional note for auto-approval failures
});

export type SingleWalletRequestResponse = z.infer<
  typeof SingleWalletRequestResponseSchema
>;

/**
 * Schema for confirm receipt response
 * Returns the updated wallet request
 */
export const ConfirmReceiptResponseSchema = z.object({
  walletRequest: WalletRequestResponseSchema,
  message: z.string().optional(),
});

export type ConfirmReceiptResponse = z.infer<
  typeof ConfirmReceiptResponseSchema
>;
