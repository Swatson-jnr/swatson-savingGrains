import axios from "axios"

interface SendSMSOptions {
  phoneNumber: string
  message: string
  context?: Record<string, string | number | boolean>
}

interface SMSResponse {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Normalize Ghana phone number to format: 233XXXXXXXXX (233 + 9 digits)
 * Handles: 0XXXXXXXXX, 233XXXXXXXXX, +233XXXXXXXXX
 */
export function normalizeGhanaPhoneNumber(phone: string): string | null {
  if (!phone) return null

  // Remove all non-numeric characters except +
  let cleaned = phone.replace(/[^\d+]/g, "")

  // Remove leading +
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1)
  }

  // If starts with 0, replace with 233
  if (cleaned.startsWith("0")) {
    cleaned = "233" + cleaned.substring(1)
  }

  // If doesn't start with 233, assume it's missing country code
  if (!cleaned.startsWith("233")) {
    cleaned = "233" + cleaned
  }

  // Validate length: should be 233 + 9 digits = 12 total
  if (cleaned.length !== 12 || !cleaned.match(/^233\d{9}$/)) {
    return null
  }

  return cleaned
}

/**
 * Send SMS via Arkesel API (production) or log to console (development)
 */
export async function sendSMS(options: SendSMSOptions): Promise<SMSResponse> {
  const { phoneNumber, message, context = {} } = options

  try {
    // Normalize phone number
    const normalizedPhone = normalizeGhanaPhoneNumber(phoneNumber)
    if (!normalizedPhone) {
      const error = `Invalid phone number format: ${phoneNumber}`
      console.error(`[SMS] ${error}`, context)
      return { success: false, error }
    }

    // Development mode: log to console instead of sending
    if (process.env.NODE_ENV !== "production") {
      console.log(`[SMS MOCK] To: ${normalizedPhone}, Message: ${message}`)
      return { success: true, messageId: `MOCK_${Date.now()}` }
    }

    // Production: send via Arkesel API
    const arkeselUrl =
      process.env.ARKESEL_BASE_URL || "https://sms.arkesel.com/api/v2"
    const apiKey = process.env.ARKESEL_API_KEY
    const senderId = process.env.ARKESEL_SENDER_ID

    if (!apiKey || !senderId) {
      const error = "Arkesel credentials not configured"
      console.error(`[SMS] ${error}`)
      return { success: false, error }
    }

    // Make request to Arkesel API (with retries)
    let lastError = ""
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await axios.post(
          `${arkeselUrl}/sms/send`,
          {
            sender: senderId,
            message: message,
            recipients: [normalizedPhone],
          },
          {
            headers: {
              "api-key": apiKey,
              "Content-Type": "application/json",
            },
            timeout: 10000,
          },
        )

        if (response.data?.status === "success") {
          console.log(`[SMS] Sent successfully to ${normalizedPhone}`)
          return {
            success: true,
            messageId: response.data?.data?.recipients?.[0],
          }
        } else {
          lastError = response.data?.message || "Unknown error"
          if (attempt < 3) {
            // Exponential backoff: 1s, 2s, 4s
            await new Promise((resolve) =>
              setTimeout(resolve, Math.pow(2, attempt - 1) * 1000),
            )
          }
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error)
        if (attempt < 3) {
          // Exponential backoff for network errors
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt - 1) * 1000),
          )
        }
      }
    }

    // All retries failed
    console.error(
      `[SMS] Failed to send to ${normalizedPhone} after 3 attempts: ${lastError}`,
    )
    return { success: false, error: lastError }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`[SMS] Service error: ${errorMessage}`, {
      phoneNumber,
      context,
    })
    return { success: false, error: errorMessage }
  }
}

/**
 * Send approval SMS notification
 */
export async function sendApprovalSMS(
  phoneNumber: string,
  amount: number,
  requestId: string,
  walletBalance: number,
): Promise<SMSResponse> {
  let message = `${amount} GHS approved for your wallet. Ref: ${requestId}. Bal: ${walletBalance} GHS. - Saving Grains`
  // Ensure message is within 160 chars, but avoid cutting off in the middle of a word
  if (message.length > 160) {
    message = message.slice(0, 157) + "..."
  }
  return sendSMS({
    phoneNumber,
    message,
    context: { action: "approval", requestId },
  })
}

/**
 * Send decline SMS notification
 */
export async function sendDeclineSMS(
  phoneNumber: string,
  amount: number,
  reason: string,
): Promise<SMSResponse> {
  const message =
    `Your ${amount} GHS request has been declined. Reason: ${reason}. - Saving Grains`.substring(
      0,
      160,
    )
  return sendSMS({ phoneNumber, message, context: { action: "decline" } })
}

/**
 * Send receipt confirmation SMS notification
 */
export async function sendReceiptConfirmationSMS(
  phoneNumber: string,
  amount: number,
  walletBalance: number,
): Promise<SMSResponse> {
  const message =
    `Receipt confirmed for ${amount} GHS. New balance: ${walletBalance} GHS. - Saving Grains`.substring(
      0,
      160,
    )
  return sendSMS({
    phoneNumber,
    message,
    context: { action: "receipt_confirmation" },
  })
}

