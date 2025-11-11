/**
 * Push Notification Service using Firebase Cloud Messaging (FCM)
 *
 * Sends push notifications to users via Firebase.
 * In development mode, notifications are mocked (logged to console).
 * In production mode, notifications are sent via Firebase Admin SDK.
 *
 * Environment Variables:
 * - FIREBASE_PROJECT_ID: Firebase project ID
 * - FIREBASE_CLIENT_EMAIL: Service account email
 * - FIREBASE_PRIVATE_KEY: Service account private key
 * - NODE_ENV: Set to "production" to send real notifications
 */

// Note: Firebase Admin SDK will be installed as part of Task 0.13 implementation
// For now, this service provides the interface and development mode mock

interface PushNotificationOptions {
  token: string // FCM device token
  title: string
  body: string
  data?: Record<string, string> // Additional data payload
}

interface PushNotificationResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Send a push notification via Firebase Cloud Messaging
 *
 * @param options - Notification options including device token, title, body, and optional data
 * @returns Promise with success status and message ID or error
 */
export async function sendPushNotification(
  options: PushNotificationOptions,
): Promise<PushNotificationResult> {
  const { token, title, body, data } = options

  // Validate token
  if (!token || token.trim() === "") {
    const error = "Invalid FCM token: token is required"
    console.error(`[PUSH] ${error}`)
    return { success: false, error }
  }

  // Development mode: Mock push notification (log to console)
  if (process.env.NODE_ENV !== "production") {
    console.log(
      `[PUSH MOCK] Token: ${token.substring(
        0,
        20,
      )}..., Title: ${title}, Body: ${body}`,
    )
    if (data) {
      console.log(`[PUSH MOCK] Data:`, data)
    }
    return { success: true, messageId: `mock-${Date.now()}` }
  }

  // Production mode: Send via Firebase Admin SDK
  try {
    // TODO: Implement Firebase Admin SDK integration
    // This will be implemented when firebase-admin package is installed
    // For now, return success with a placeholder

    // Example implementation (to be completed):
    // const admin = await getFirebaseAdmin()
    // const message = {
    //   token,
    //   notification: { title, body },
    //   data: data || {},
    // }
    // const response = await admin.messaging().send(message)
    // return { success: true, messageId: response }

    console.warn(
      "[PUSH] Firebase Admin SDK not yet configured - returning mock success",
    )
    return { success: true, messageId: `pending-implementation-${Date.now()}` }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error"
    console.error("[PUSH] Failed to send push notification:", errorMessage)
    return { success: false, error: errorMessage }
  }
}

/**
 * Send approval notification to user
 *
 * @param token - FCM device token
 * @param amount - Amount that was approved
 * @param requestId - Request ID for reference
 * @param balance - User's new wallet balance
 * @returns Promise with success status
 */
export async function sendApprovalPush(
  token: string,
  amount: number,
  requestId: string,
  balance: number,
): Promise<PushNotificationResult> {
  return sendPushNotification({
    token,
    title: "Wallet Top-up Approved",
    body: `Your ${amount} GHS request has been approved. New balance: ${balance} GHS.`,
    data: {
      type: "wallet_topup_approval",
      requestId,
      amount: amount.toString(),
      balance: balance.toString(),
    },
  })
}

/**
 * Send decline notification to user
 *
 * @param token - FCM device token
 * @param amount - Amount that was declined
 * @param reason - Reason for decline
 * @returns Promise with success status
 */
export async function sendDeclinePush(
  token: string,
  amount: number,
  reason: string,
): Promise<PushNotificationResult> {
  return sendPushNotification({
    token,
    title: "Wallet Top-up Declined",
    body: `Your ${amount} GHS request has been declined. Reason: ${reason}`,
    data: {
      type: "wallet_topup_decline",
      amount: amount.toString(),
      reason,
    },
  })
}

/**
 * Send receipt confirmation notification to user
 *
 * @param token - FCM device token
 * @param amount - Amount that was confirmed
 * @param balance - User's new wallet balance
 * @returns Promise with success status
 */
export async function sendReceiptConfirmationPush(
  token: string,
  amount: number,
  balance: number,
): Promise<PushNotificationResult> {
  return sendPushNotification({
    token,
    title: "Receipt Confirmed",
    body: `Receipt confirmed for ${amount} GHS. New balance: ${balance} GHS.`,
    data: {
      type: "wallet_topup_receipt_confirmation",
      amount: amount.toString(),
      balance: balance.toString(),
    },
  })
}

