import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { authenticate } from "@/lib/middleware/authMiddleware";
import { confirmWalletReceipt } from "@/lib/services/wallet.transactions";
import WalletRequest from "@/lib/models/walletRequest";
import User from "@/lib/models/user";
import { sendReceiptConfirmationSMS } from "@/lib/services/sms.service";
import { sendReceiptConfirmationPush } from "@/lib/services/push-notification.service";
import logger from "@/lib/utils/logger";
import { PopulatedWalletRequest } from "@/lib/types/wallet-request.types";
import {
  validateRequestBody,
  validateResponseData,
} from "@/lib/middleware/validateSchema";
import { ConfirmReceiptSchema } from "@/lib/schemas/wallet-request-schemas";
import { ConfirmReceiptResponseSchema } from "@/lib/schemas/wallet-response-schemas";
// import { ConfirmReceiptSchema } from "@/lib/schemas/wallet-request.schemas"
// import { ConfirmReceiptResponseSchema } from "@/lib/schemas/wallet-response.schemas"

/**
 * @swagger
 * /api/wallet-topup-request/{id}/confirm-receipt:
 *   put:
 *     summary: Confirm receipt of approved wallet funds
 *     description: |
 *       Allows users to confirm they have received their approved wallet funds.
 *       Changes status from "approved" to "successful".
 *       Only the request owner can confirm receipt.
 *       Idempotent - returns success if already confirmed.
 *     tags:
 *       - Wallet Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet request ID
 *     responses:
 *       200:
 *         description: Receipt confirmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Receipt confirmed successfully"
 *                 walletRequest:
 *                   type: object
 *                   description: Updated wallet request with status "successful"
 *       400:
 *         description: Invalid request (e.g., not approved status)
 *       403:
 *         description: Forbidden - user is not the owner of the request
 *       404:
 *         description: Wallet request not found
 */
// export async function PUT(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();

//     // Authenticate user
//     const auth = await authenticate(req);
//     if (auth.error) {
//       return NextResponse.json({ error: auth.error }, { status: auth.status });
//     }

//     // Validate request body (empty body allowed, but reject extra fields)
//     const validation = await validateRequestBody(req, ConfirmReceiptSchema);
//     if (!validation.success) {
//       return validation.response;
//     }

//     const { id } = await params;

//     // Call the service layer function
//     const result = await confirmWalletReceipt(id, auth.user!.id);

//     if (!result.success) {
//       // Check if it's an authorization error
//       if (result.error?.includes("Unauthorized")) {
//         return NextResponse.json({ error: result.error }, { status: 403 });
//       }
//       // All other errors are bad request
//       return NextResponse.json({ error: result.error }, { status: 400 });
//     }

//     // Fetch the updated request to return to client
//     const updatedRequest = await WalletRequest.findById(id)
//       .populate("user", "first_name last_name email phone_number")
//       .lean();

//     if (!updatedRequest) {
//       return NextResponse.json(
//         { error: "Wallet request not found" },
//         { status: 404 }
//       );
//     }

//     // Type assertion for lean() result
//     const request = updatedRequest as unknown as PopulatedWalletRequest;

//     // Send SMS notification (don't block on failure)
//     try {
//       if (request.user?.phone_number) {
//         // Get updated user wallet balance
//         const user = await User.findById(request.user._id);
//         const walletBalance = user?.walletBalance || 0;

//         await sendReceiptConfirmationSMS(
//           request.user.phone_number,
//           request.amount,
//           walletBalance
//         );
//         logger.info("Receipt confirmation SMS sent successfully", {
//           requestId: id,
//           phoneNumber: request.user.phone_number,
//           amount: request.amount,
//         });
//       }
//     } catch (smsError) {
//       // Log SMS error but don't block the request
//       logger.error("Failed to send receipt confirmation SMS", {
//         requestId: id,
//         error: smsError instanceof Error ? smsError.message : String(smsError),
//         stack: smsError instanceof Error ? smsError.stack : undefined,
//       });
//     }

//     // Send push notification (don't block on failure)
//     try {
//       // TODO: Add fcm_token field to User model
//       const user = await User.findById(request.user?._id);
//       const fcmToken = (user as { fcm_token?: string })?.fcm_token;

//       if (fcmToken) {
//         const walletBalance = user?.walletBalance || 0;
//         await sendReceiptConfirmationPush(
//           fcmToken,
//           request.amount,
//           walletBalance
//         );
//         logger.info(
//           "Receipt confirmation push notification sent successfully",
//           {
//             requestId: id,
//             amount: request.amount,
//           }
//         );
//       }
//     } catch (pushError) {
//       // Log push error but don't block the request
//       logger.error("Failed to send receipt confirmation push notification", {
//         requestId: id,
//         error:
//           pushError instanceof Error ? pushError.message : String(pushError),
//         stack: pushError instanceof Error ? pushError.stack : undefined,
//       });
//     }

//     const responseData = {
//       message: "Receipt confirmed successfully",
//       walletRequest: {
//         _id: request._id.toString(),
//         user: request.user,
//         amount: request.amount,
//         payment_method: request.payment_method,
//         provider: request.provider,
//         phone_number: request.phone_number,
//         bank_name: request.bank_name,
//         branch_name: request.branch_name,
//         reason: request.reason,
//         status: request.status,
//         reviewed_by: (
//           request.reviewed_by as { toString: () => string } | undefined
//         )?.toString(),
//         reviewed_at: request.reviewed_at,
//         rejectionReason: request.rejectionReason,
//         confirmed_at: request.confirmed_at,
//         createdAt: request.createdAt,
//         updatedAt: request.updatedAt,
//       },
//     };

//     // Validate response data
//     const responseValidation = validateResponseData(
//       responseData,
//       ConfirmReceiptResponseSchema,
//       {
//         endpoint: "/api/wallet-topup-request/[id]/confirm-receipt",
//         method: "PUT",
//       }
//     );
//     if (!responseValidation.success) return responseValidation.response;

//     return NextResponse.json(responseValidation.data, { status: 200 });
//   } catch (error) {
//     logger.error("Error confirming receipt", {
//       error: error instanceof Error ? error.message : String(error),
//       stack: error instanceof Error ? error.stack : undefined,
//     });
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const auth = await authenticate(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;

    // Parse the request body once
    const body = await req.json();

    // ✅ FIX: await the validator
    const validation = await validateRequestBody(body, ConfirmReceiptSchema);

    if (!validation.success) {
      return validation.response;
    }

    const { payment_method } = body;

    if (!payment_method) {
      return NextResponse.json(
        { error: "payment_method is required" },
        { status: 400 }
      );
    }

    // Update payment method + approve
    const updatedRequest = await WalletRequest.findByIdAndUpdate(
      id,
      {
        payment_method,
        status: "approved",
        reviewed_by: auth.user!.id,
        reviewed_at: new Date(),
      },
      { new: true }
    );

    if (!updatedRequest) {
      return NextResponse.json(
        { error: "Wallet request not found" },
        { status: 404 }
      );
    }

    // Call service logic
    const result = await confirmWalletReceipt(id, auth.user!.id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error?.includes("Unauthorized") ? 403 : 400 }
      );
    }

    // Fetch updated + populated version
    const populated = await WalletRequest.findById(id)
      .populate("user", "first_name last_name email phone_number")
      .lean();

    if (!populated) {
      return NextResponse.json(
        { error: "Wallet request not found after update" },
        { status: 404 }
      );
    }

    const request = populated as unknown as PopulatedWalletRequest;

    // async notification (non-blocking)
    queueMicrotask(async () => {
      try {
        const user = await User.findById(request.user?._id);
        const walletBalance = user?.walletBalance || 0;

        if (request.user?.phone_number) {
          await sendReceiptConfirmationSMS(
            request.user.phone_number,
            request.amount,
            walletBalance
          );
        }

        if (user?.fcm_token) {
          await sendReceiptConfirmationPush(
            user.fcm_token,
            request.amount,
            walletBalance
          );
        }
      } catch (err) {
        logger.error("Notification error", { error: err });
      }
    });

    // Build response
    const responseData = {
      message: "Receipt confirmed successfully",
      walletRequest: {
        _id: request._id.toString(),
        user: request.user,
        amount: request.amount,
        payment_method: request.payment_method,
        provider: request.provider,
        phone_number: request.phone_number,
        bank_name: request.bank_name,
        branch_name: request.branch_name,
        reason: request.reason,
        status: request.status,
        reviewed_by: request.reviewed_by?.toString(),
        reviewed_at: request.reviewed_at,
        rejectionReason: request.rejectionReason,
        confirmed_at: request.confirmed_at,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      },
    };

    // Validate response
    const responseValidation = validateResponseData(
      responseData,
      ConfirmReceiptResponseSchema,
      {
        endpoint: "/api/wallet-topup-request/[id]/confirm-receipt",
        method: "PUT",
      }
    );

    if (!responseValidation.success) {
      return responseValidation.response;
    }

    return NextResponse.json(responseValidation.data, { status: 200 });
  } catch (error) {
    logger.error("Error confirming receipt", {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
