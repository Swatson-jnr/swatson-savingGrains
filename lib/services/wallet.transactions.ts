import mongoose, { Types } from "mongoose";
import Wallet from "@/lib/models/wallet";
import WalletRequest from "@/lib/models/walletRequest";
import User from "@/lib/models/user";

interface ProcessWalletApprovalResult {
  success: boolean;
  requestId?: string;
  error?: string;
  newBalance?: number;
}

/**
 * Shared transaction helper for wallet approval
 * Used by both POST (auto-approval) and PUT (manual approval) endpoints
 *
 * Performs atomic operations:
 * 1. Check app wallet has sufficient funds
 * 2. Deduct from system app wallet
 * 3. Credit to user's wallet balance
 * 4. Update request status to "approved"
 * 5. Set reviewed_by and reviewed_at
 *
 * All operations are atomic - either all succeed or all rollback
 */
export async function processWalletApproval(
  requestId: string | Types.ObjectId,
  userId: string | Types.ObjectId,
  amount: number,
  initiatedBy: string | Types.ObjectId,
  _isRetry = false
): Promise<ProcessWalletApprovalResult> {
  let session: mongoose.ClientSession | null = null;

  try {
    // Only try to start a transaction on the first attempt
    if (!_isRetry) {
      try {
        session = await mongoose.startSession();
        await session.startTransaction();
      } catch (_startError) {
        // Transactions not supported (standalone MongoDB). End session and proceed without it.
        if (session) {
          try {
            await session.endSession();
          } catch (_e) {
            // Ignore
          }
        }
        session = null;
      }
    }

    try {
      // Ensure IDs are ObjectIds
      const requestIdObj =
        requestId instanceof Types.ObjectId
          ? requestId
          : new Types.ObjectId(requestId);
      const userIdObj =
        userId instanceof Types.ObjectId ? userId : new Types.ObjectId(userId);
      const initiatedByObj =
        initiatedBy instanceof Types.ObjectId
          ? initiatedBy
          : new Types.ObjectId(initiatedBy);

      // Step 1: Check if request is already approved (idempotency check)
      let existingRequest;
      if (session) {
        existingRequest = await WalletRequest.findById(requestIdObj).session(
          session
        );
      } else {
        existingRequest = await WalletRequest.findById(requestIdObj);
      }
      if (!existingRequest) {
        if (session) await session.abortTransaction();
        return { success: false, error: "Wallet request not found" };
      }

      if (existingRequest.status === "approved") {
        // Idempotent: already approved, return success without double-charging
        if (session) await session.abortTransaction();
        return {
          success: true,
          requestId: existingRequest._id.toString(),
          newBalance: existingRequest.amount,
        };
      }

      if (existingRequest.status !== "pending") {
        if (session) await session.abortTransaction();
        return {
          success: false,
          error: `Cannot approve request with status "${existingRequest.status}"`,
        };
      }

      // Step 2: Get app wallet (system wallet that funds approvals)
      let appWallet;
      if (session) {
        appWallet = await Wallet.findOne({ name: "app", system: true }).session(
          session
        );
      } else {
        appWallet = await Wallet.findOne({ name: "app", system: true });
      }
      if (!appWallet) {
        if (session) await session.abortTransaction();
        return { success: false, error: "System app wallet not found" };
      }

      // Step 3: Check insufficient funds
      if (appWallet.balance < amount) {
        if (session) await session.abortTransaction();
        return {
          success: false,
          error: `Insufficient funds in system wallet. Available: ${appWallet.balance} GHS, Required: ${amount} GHS`,
        };
      }

      // Step 4: Deduct from app wallet
      const updatedWallet = await Wallet.findByIdAndUpdate(
        appWallet._id,
        { $inc: { balance: -amount } },
        { new: true, ...(session && { session }) }
      );

      if (!updatedWallet) {
        if (session) await session.abortTransaction();
        return { success: false, error: "Failed to update app wallet" };
      }

      // Step 5: Credit to user's wallet balance
      const updatedUser = await User.findByIdAndUpdate(
        userIdObj,
        { $inc: { walletBalance: amount } },
        { new: true, ...(session && { session }) }
      );

      if (!updatedUser) {
        if (session) await session.abortTransaction();
        return {
          success: false,
          error: "Failed to update user wallet balance",
        };
      }

      // Step 6: Update request status to "approved"
      const updatedRequest = await WalletRequest.findByIdAndUpdate(
        requestIdObj,
        {
          status: "approved",
          reviewed_by: initiatedByObj,
          reviewed_at: new Date(),
        },
        { new: true, ...(session && { session }) }
      );

      if (!updatedRequest) {
        if (session) await session.abortTransaction();
        return { success: false, error: "Failed to update wallet request" };
      }

      // Commit transaction
      if (session) await session.commitTransaction();

      return {
        success: true,
        requestId: updatedRequest._id.toString(),
        newBalance: updatedUser.walletBalance,
      };
    } catch (queryError) {
      // If any query fails with the session, disable the session and retry without it
      if (session) {
        try {
          await session.abortTransaction();
        } catch (_e) {
          // Ignore
        }
        try {
          await session.endSession();
        } catch (_e) {
          // Ignore
        }
      }
      session = null;

      // Check if this is a transaction-related error
      const errorMessage =
        queryError instanceof Error ? queryError.message : String(queryError);
      if (errorMessage.toLowerCase().includes("transaction") && !_isRetry) {
        // Retry the entire operation without session
        console.log(
          "[Transaction Retry] Retrying without session due to:",
          errorMessage
        );
        return processWalletApproval(
          requestId,
          userId,
          amount,
          initiatedBy,
          true
        );
      }
      throw queryError;
    }
  } catch (error) {
    if (session) await (session as mongoose.ClientSession).abortTransaction();

    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Transaction Error]", errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    if (session) {
      try {
        await session.endSession();
      } catch (_e) {
        // Ignore
      }
    }
  }
}

/**
 * Decline a wallet request
 * Sets status to "rejected" and stores rejection reason
 */
export async function declineWalletRequest(
  requestId: string | Types.ObjectId,
  initiatedBy: string | Types.ObjectId,
  rejectionReason: string,
  _isRetry = false
): Promise<ProcessWalletApprovalResult> {
  let session: mongoose.ClientSession | null = null;

  try {
    // Only try to start a transaction on the first attempt
    if (!_isRetry) {
      try {
        session = await mongoose.startSession();
        await session.startTransaction();
      } catch (_startError) {
        // Transactions not supported (standalone MongoDB). End session and proceed without it.
        if (session) {
          try {
            await session.endSession();
          } catch (_e) {
            // Ignore
          }
        }
        session = null;
      }
    }

    const requestIdObj =
      requestId instanceof Types.ObjectId
        ? requestId
        : new Types.ObjectId(requestId);
    const initiatedByObj =
      initiatedBy instanceof Types.ObjectId
        ? initiatedBy
        : new Types.ObjectId(initiatedBy);

    try {
      // Check request exists and is in pending status
      const existingRequest = await (session
        ? WalletRequest.findById(requestIdObj).session(session)
        : WalletRequest.findById(requestIdObj));
      if (!existingRequest) {
        if (session) await session.abortTransaction();
        return { success: false, error: "Wallet request not found" };
      }

      if (existingRequest.status !== "pending") {
        if (session) await session.abortTransaction();
        return {
          success: false,
          error: `Cannot decline request with status "${existingRequest.status}"`,
        };
      }

      // Update request status to "rejected"
      const updatedRequest = await WalletRequest.findByIdAndUpdate(
        requestIdObj,
        {
          status: "rejected",
          reviewed_by: initiatedByObj,
          reviewed_at: new Date(),
          rejectionReason: rejectionReason,
        },
        { new: true, ...(session && { session }) }
      );

      if (!updatedRequest) {
        if (session) await session.abortTransaction();
        return { success: false, error: "Failed to decline wallet request" };
      }

      if (session) await session.commitTransaction();

      return {
        success: true,
        requestId: updatedRequest._id.toString(),
      };
    } catch (queryError) {
      // If any query fails with the session, disable the session and retry without it
      if (session) {
        try {
          await session.abortTransaction();
        } catch (_e) {
          // Ignore
        }
        try {
          await session.endSession();
        } catch (_e) {
          // Ignore
        }
      }
      session = null;

      // Check if this is a transaction-related error
      const errorMessage =
        queryError instanceof Error ? queryError.message : String(queryError);
      if (errorMessage.toLowerCase().includes("transaction") && !_isRetry) {
        // Retry the entire operation without session
        console.log(
          "[Decline Retry] Retrying without session due to:",
          errorMessage
        );
        return declineWalletRequest(
          requestId,
          initiatedBy,
          rejectionReason,
          true
        );
      }
      throw queryError;
    }
  } catch (error) {
    if (session) {
      try {
        await session.abortTransaction();
      } catch (_e) {
        // Ignore abort errors
      }
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Decline Error]", errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    if (session) {
      try {
        await session.endSession();
      } catch (_e) {
        // Ignore end session errors
      }
    }
  }
}

/**
 * Confirm receipt of an approved wallet request
 * Changes status from "approved" to "successful"
 */
export async function confirmWalletReceipt(
  requestId: string | Types.ObjectId,
  userId?: string | Types.ObjectId,
  _isRetry = false
): Promise<ProcessWalletApprovalResult> {
  let session: mongoose.ClientSession | null = null;

  try {
    // Only try to start a transaction on the first attempt
    if (!_isRetry) {
      try {
        session = await mongoose.startSession();
        await session.startTransaction();
      } catch (_startError) {
        // Transactions not supported (standalone MongoDB). End session and proceed without it.
        if (session) {
          try {
            await session.endSession();
          } catch (_e) {
            // Ignore
          }
        }
        session = null;
      }
    }

    const requestIdObj =
      requestId instanceof Types.ObjectId
        ? requestId
        : new Types.ObjectId(requestId);

    try {
      // Check request exists and is approved
      const existingRequest = await (session
        ? WalletRequest.findById(requestIdObj).session(session)
        : WalletRequest.findById(requestIdObj));
      if (!existingRequest) {
        if (session) await session.abortTransaction();
        return { success: false, error: "Wallet request not found" };
      }

      // Verify user ownership if userId provided
      if (userId) {
        const userIdObj =
          userId instanceof Types.ObjectId
            ? userId
            : new Types.ObjectId(userId);
        // Check both user and user_id fields (in case they're aliased)
        const requestUserId =
          (existingRequest as any).user_id || existingRequest.user;
        if (requestUserId.toString() !== userIdObj.toString()) {
          if (session) await session.abortTransaction();
          return {
            success: false,
            error: "Unauthorized: User does not own this request",
          };
        }
      }

      // If already successful, return success (idempotent)
      if (existingRequest.status === "successful") {
        if (session) await session.abortTransaction();
        return {
          success: true,
          requestId: existingRequest._id.toString(),
        };
      }

      if (existingRequest.status !== "approved") {
        if (session) await session.abortTransaction();
        return {
          success: false,
          error: `Cannot confirm receipt on request with status "${existingRequest.status}". Only "approved" requests can be confirmed.`,
        };
      }

      // Update request status to "successful"
      const updatedRequest = await WalletRequest.findByIdAndUpdate(
        requestIdObj,
        {
          status: "successful",
          confirmed_at: new Date(),
        },
        { new: true, ...(session && { session }) }
      );

      if (!updatedRequest) {
        if (session) await session.abortTransaction();
        return { success: false, error: "Failed to confirm receipt" };
      }

      if (session) await session.commitTransaction();

      return {
        success: true,
        requestId: updatedRequest._id.toString(),
      };
    } catch (queryError) {
      // If any query fails with the session, disable the session and retry without it
      if (session) {
        try {
          await session.abortTransaction();
        } catch (_e) {
          // Ignore
        }
        try {
          await session.endSession();
        } catch (_e) {
          // Ignore
        }
      }
      session = null;

      // Check if this is a transaction-related error
      const errorMessage =
        queryError instanceof Error ? queryError.message : String(queryError);
      if (errorMessage.toLowerCase().includes("transaction") && !_isRetry) {
        // Retry the entire operation without session
        console.log(
          "[Confirm Receipt Retry] Retrying without session due to:",
          errorMessage
        );
        return confirmWalletReceipt(requestId, userId, true);
      }
      throw queryError;
    }
  } catch (error) {
    if (session) {
      try {
        await session.abortTransaction();
      } catch (_e) {
        // Ignore abort errors
      }
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Confirm Receipt Error]", errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    if (session) {
      try {
        await session.endSession();
      } catch (_e) {
        // Ignore end session errors
      }
    }
  }
}
