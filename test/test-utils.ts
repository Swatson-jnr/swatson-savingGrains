import { Types } from "mongoose"

/**
 * Create a valid MongoDB ObjectId
 */
export function createObjectId(): Types.ObjectId {
  return new Types.ObjectId()
}

/**
 * Create a valid MongoDB ObjectId string
 */
export function createObjectIdString(): string {
  return new Types.ObjectId().toString()
}

/**
 * Convert ObjectId to string if needed
 */
export function toObjectIdString(id: string | Types.ObjectId): string {
  if (typeof id === "string") return id
  return id.toString()
}

/**
 * Assert that a value is truthy
 */
export function assertTruthy(value: unknown, message: string): void {
  if (!value) throw new Error(message)
}

/**
 * Assert that two values are equal
 */
export function assertEqual(
  actual: unknown,
  expected: unknown,
  message: string,
): void {
  if (actual !== expected) {
    throw new Error(`${message} - Expected: ${expected}, Actual: ${actual}`)
  }
}

/**
 * Wait for a specified time (in milliseconds)
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

