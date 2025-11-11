/**
 * Centralized User Type Definitions
 * Task 0.20: Create centralized type definitions
 *
 * This file contains all user-related types used across the application.
 * Eliminates duplicate IUser definitions in route files.
 */

import { Types } from "mongoose"
import { IUser } from "@/lib/models/user"

/**
 * Lean User type - Plain JavaScript object after .lean() or .toObject()
 * Use this for API responses and when working with plain objects (not Mongoose documents)
 */
export interface LeanUser {
  _id: string | Types.ObjectId
  first_name: string
  last_name: string
  email: string
  phone_number: string
  passcode: string
  roles?: string[]
  system: boolean
  otp?: string | null
  otp_expires_at?: Date | null
  walletBalance: number
  fcm_token?: string | null
  createdAt?: Date
  updatedAt?: Date
  full_name?: string
}

/**
 * Populated User for API responses
 * Excludes sensitive fields like passcode, otp
 */
export interface PopulatedUser {
  _id: string | Types.ObjectId
  first_name: string
  last_name: string
  email: string
  phone_number: string
  roles?: string[]
  system: boolean
  walletBalance: number
  fcm_token?: string | null
  createdAt?: Date
  updatedAt?: Date
  full_name?: string
}

/**
 * Minimal User info for wallet requests and embedded references
 */
export interface UserReference {
  _id: string | Types.ObjectId
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string
}

/**
 * Auth User payload from JWT token
 */
export interface AuthUser {
  id: string
  phone_number: string
}

/**
 * User for login/authentication responses (includes token-related fields)
 */
export interface AuthUserResponse extends Omit<PopulatedUser, "passcode"> {
  otp?: string | null
  otp_expires_at?: Date | null
}

// Export the base model interface for when you need the full Document type
export type { IUser }

