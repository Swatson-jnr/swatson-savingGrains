/**
 * Validation middleware for Zod schemas
 * Phase 0a: Request body validation
 */

import { NextRequest, NextResponse } from "next/server"
import { ZodSchema, ZodError } from "zod"
import logger from "../utils/logger";
// import { logger } from "@/lib/utils/logger"

/**
 * Extracts and formats validation errors from a ZodError object.
 *
 * @param error - The ZodError instance containing validation issues.
 * @returns An array of objects with field, message, and code for each validation issue.
 */
export function formatZodErrors(error: ZodError) {
  return error.issues.map((err) => ({
    field: err.path.join("."),
    message: err.message,
    code: err.code,
  }))
}

/**
 * Creates a standardized validation error response
 * Returns single error message if only one error, otherwise returns "Validation failed" with details
 *
 * @param errors - Array of formatted validation errors
 * @returns Object with error message and optional details array
 */
function createValidationErrorResponse(
  errors: Array<{ field: string; message: string; code: string }>,
) {
  const errorMessage =
    errors.length === 1 ? errors[0].message : "Validation failed"

  return {
    error: errorMessage,
    ...(errors.length > 1 && { details: errors }),
  }
}

/**
 * Validates request body against a Zod schema
 * Returns validation errors as structured JSON response
 *
 * @param request - NextRequest object
 * @param schema - Zod schema to validate against
 * @returns Parsed and validated data, or NextResponse with 400 error
 */
export async function validateRequestBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>,
): Promise<
  { success: true; data: T } | { success: false; response: NextResponse }
> {
  let body: unknown

  try {
    // Clone the request to check if it has a body
    const clonedRequest = request.clone()
    const text = await clonedRequest.text()

    // If body is empty or whitespace only, treat as empty object
    if (!text || text.trim() === "") {
      body = {}
    } else {
      // Parse request body
      body = await request.json()
    }
  } catch (error) {
    // Handle JSON parsing errors (including SyntaxError, TypeError, etc.)
    logger.warn("Invalid JSON in request body", {
      url: request.url,
      method: request.method,
      error: error instanceof Error ? error.message : String(error),
    })

    return {
      success: false,
      response: NextResponse.json(
        {
          error: "Invalid JSON in request body",
        },
        { status: 400 },
      ),
    }
  }

  // Validate the parsed body against the schema
  const result = schema.safeParse(body)

  if (!result.success) {
    // Format Zod errors for client
    const errors = formatZodErrors(result.error)

    logger.warn("Request body validation failed", {
      url: request.url,
      method: request.method,
      errors,
      body: JSON.stringify(body),
    })

    return {
      success: false,
      response: NextResponse.json(createValidationErrorResponse(errors), {
        status: 400,
      }),
    }
  }

  return {
    success: true,
    data: result.data,
  }
}

/**
 * Validates URL query parameters against a Zod schema
 * @param request - NextRequest object
 * @param schema - Zod schema to validate against
 * @returns Parsed and validated query params, or NextResponse with 400 error
 */
export async function validateQueryParams<T>(
  request: NextRequest,
  schema: ZodSchema<T>,
): Promise<
  { success: true; data: T } | { success: false; response: NextResponse }
> {
  // Extract query parameters from URL
  const { searchParams } = new URL(request.url)
  const queryObject: Record<string, string> = {}

  // Convert URLSearchParams to plain object
  searchParams.forEach((value, key) => {
    queryObject[key] = value
  })

  // Validate against schema
  const result = schema.safeParse(queryObject)

  if (!result.success) {
    // Format Zod errors for client
    const errors = formatZodErrors(result.error)

    logger.warn("Query parameter validation failed", {
      url: request.url,
      method: request.method,
      errors,
      queryParams: JSON.stringify(queryObject),
    })

    return {
      success: false,
      response: NextResponse.json(createValidationErrorResponse(errors), {
        status: 400,
      }),
    }
  }

  return {
    success: true,
    data: result.data,
  }
}


/**
 * Validates response data against a Zod schema before sending to client
 * Returns 500 Internal Server Error if response data is invalid (data integrity issue)
 *
 * @param data - Response data to validate
 * @param schema - Zod schema to validate against
 * @param context - Optional context for logging (e.g., endpoint name)
 * @returns Validated data or NextResponse with 500 error
 */
export function validateResponseData<T>(
  data: unknown,
  schema: ZodSchema<T>,
  context?: { endpoint?: string; method?: string },
): { success: true; data: T } | { success: false; response: NextResponse } {
  const result = schema.safeParse(data)

  if (!result.success) {
    // Format Zod errors for logging
    const errors = formatZodErrors(result.error)

    logger.error(
      `Response validation failed${context?.endpoint ? ` for ${context.method || 'UNKNOWN'} ${context.endpoint}` : ""} - data integrity issue`,
      {
        endpoint: context?.endpoint || "unknown",
        method: context?.method || "unknown",
        errors,
        // Don't log full response data to avoid leaking sensitive info
        errorCount: errors.length,
      }
    )

    // Return 500 Internal Server Error - this is a server-side data integrity issue
    return {
      success: false,
      response: NextResponse.json(
        {
          error:
            "Internal server error: response data validation failed. Please contact support.",
        },
        { status: 500 },
      ),
    }
  }

  return {
    success: true,
    data: result.data,
  }
}
