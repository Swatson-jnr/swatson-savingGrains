/**
 * Centralized Wallet Request Type Definitions
 * Task 0.20: Create centralized type definitions
 *
 * This file contains all wallet request-related types used across the application.
 * Eliminates duplicate type definitions in route files.
 */

import { UserReference } from "./user.types"
import { WalletRequestStatus } from "@/lib/models/walletRequest.enums"
import { Types } from "mongoose"

/**
 * Wallet Request with populated user reference
 * Used across all endpoints (GET, PUT) where user data is populated
 */
export interface WalletRequest {
  _id: Types.ObjectId | string
  user?: UserReference
  amount: number
  payment_method?: string | null
  provider?: string
  phone_number?: string
  bank_name?: string
  branch_name?: string
  reason?: string
  status: WalletRequestStatus
  reviewed_by?: unknown | { toString: () => string }
  reviewed_at?: Date
  rejectionReason?: string
  confirmed_at?: Date
  processedBy?: unknown | { toString: () => string }
  currency?: string
  createdAt: Date
  updatedAt: Date
}

// Legacy aliases for backward compatibility (can be removed after full refactoring)
export type PopulatedWalletRequest = WalletRequest
export type PutPopulatedWalletRequest = WalletRequest

/**
 * Wallet Request Response for API
 * Standardized response format
 */
export interface WalletRequestResponse {
  _id: string
  user: string | UserReference
  amount: number
  payment_method?: string | null
  provider?: string
  phone_number?: string
  bank_name?: string
  branch_name?: string
  reason?: string
  status: string
  reviewed_by?: string
  reviewed_at?: string | Date
  rejectionReason?: string
  confirmed_at?: string | Date
  createdAt: string | Date
  updatedAt: string | Date
}

/**
 * Create Wallet Request payload (POST body)
 */
export interface CreateWalletRequestPayload {
  amount: number
  reason?: string
  payment_method?: string
  provider?: string
  phone_number?: string
  bank_name?: string
  branch_name?: string
}

/**
 * Update Wallet Request payload (PUT body)
 */
export interface UpdateWalletRequestPayload {
  status?: string
  payment_method?: string
  provider?: string
  phone_number?: string
  bank_name?: string
  branch_name?: string
  rejectionReason?: string
}

/**
 * Wallet Request filters for GET queries
 */
export interface WalletRequestFilters {
  status?: string
  user?: string
  start_date?: string
  end_date?: string
  page?: string
  limit?: string
}

/**
 * Paginated Wallet Request Response
 */
export interface PaginatedWalletRequestResponse {
  requests: WalletRequestResponse[]
  total: number
  page: number
  limit: number
  totalPages: number
}

