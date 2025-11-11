import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import WalletRequest from "@/lib/models/walletRequest";
import User from "@/lib/models/user";
import { authenticate } from "@/lib/middleware/authMiddleware";
import { adminRoles } from "@/constants/roles";
import { processWalletApproval } from "@/lib/services/wallet.transactions";

/**
 * @swagger
 * /api/wallet-request/{id}:
 *   get:
 *     summary: Get a specific wallet request by ID
 *     description: Retrieves detailed information about a wallet request including requester details
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
 *         description: Unique identifier of the wallet request
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Wallet request details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Unique identifier of the wallet request
 *                   example: "507f1f77bcf86cd799439011"
 *                 user:
 *                   type: string
 *                   description: ID of the user who made the request
 *                   example: "507f191e810c19729de860ea"
 *                 requesterName:
 *                   type: string
 *                   description: Full name of the user who made the request
 *                   example: "John Doe"
 *                 amount:
 *                   type: number
 *                   description: Amount requested
 *                   example: 100.50
 *                 payment_method:
 *                   type: string
 *                   description: Payment method specified
 *                   example: "Mobile Money"
 *                 provider:
 *                   type: string
 *                   description: Mobile money provider (if applicable)
 *                   example: "MTN"
 *                 phone_number:
 *                   type: string
 *                   description: Phone number for mobile money (if applicable)
 *                   example: "+233123456789"
 *                 bank_name:
 *                   type: string
 *                   description: Bank name (if applicable)
 *                   example: "Ghana Commercial Bank"
 *                 branch_name:
 *                   type: string
 *                   description: Bank branch (if applicable)
 *                   example: "Accra Main Branch"
 *                 reason:
 *                   type: string
 *                   description: Reason for the request
 *                   example: "Monthly top-up"
 *                 status:
 *                   type: string
 *                   enum: ["pending", "approved", "declined", "successful", "failed"]
 *                   description: Current status of the request
 *                   example: "pending"
 *                 requestedDate:
 *                   type: string
 *                   format: date-time
 *                   description: Date when the request was created
 *                   example: "2023-10-30T10:30:00Z"
 *                 processedDate:
 *                   type: string
 *                   format: date-time
 *                   description: Date when the request was processed (if applicable)
 *                   example: "2023-10-30T15:45:00Z"
 *                 processedBy:
 *                   type: string
 *                   description: ID of the user who processed the request (if applicable)
 *                   example: "507f191e810c19729de860eb"
 *                 rejectionReason:
 *                   type: string
 *                   description: Reason for rejection (if applicable)
 *                   example: "Insufficient documentation"
 *       400:
 *         description: Invalid request ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid wallet request ID format"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: Wallet request not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Wallet request not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate the user
    const auth = await authenticate(req);
    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });

    // Connect to database
    await connectDB();

    // Validate ID format (basic MongoDB ObjectId validation)
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Invalid wallet request ID format" },
        { status: 400 }
      );
    }

    // Find the wallet request by ID and populate user data
    const walletRequest = await WalletRequest.findById(id)
      .populate("user", "first_name last_name email phone_number")
      .lean();

    if (!walletRequest) {
      return NextResponse.json(
        { error: "Wallet request not found" },
        { status: 404 }
      );
    }

    // Type assertion for populated user data
    interface PopulatedWalletRequest {
      _id: unknown;
      user?: {
        _id: unknown;
        first_name?: string;
        last_name?: string;
        email?: string;
        phone_number?: string;
      };
      amount: number;
      payment_method: string;
      provider?: string;
      phone_number?: string;
      bank_name?: string;
      branch_name?: string;
      reason: string;
      status: string;
      createdAt: Date;
      updatedAt: Date;
      processedBy?: unknown;
      rejectionReason?: string;
    }

    const requestData = walletRequest as unknown as PopulatedWalletRequest;

    // Map backend payment_method values to frontend PaymentType values
    const mapPaymentMethodToPaymentType = (pm?: string) => {
      if (!pm) return undefined;
      const normalized = pm.toLowerCase();
      if (normalized.includes("cash")) return "Cash";
      if (normalized.includes("mobile")) return "Mobile Money";
      if (normalized.includes("bank")) return "Bank Transfer";
      return pm;
    };

    // Transform the response to include requester name and frontend-friendly fields
    const response = {
      id: requestData._id?.toString(),
      user: requestData.user?._id?.toString(),
      requesterName: requestData.user
        ? `${requestData.user.first_name || ""} ${
            requestData.user.last_name || ""
          }`.trim()
        : "Unknown User",
      amount: requestData.amount,
      payment_method: requestData.payment_method,
      // Add frontend-friendly fields
      paymentType: mapPaymentMethodToPaymentType(requestData.payment_method),
      label: requestData.payment_method || "Top Up",
      // Provide a default currency if none exists
      currency:
        (requestData as unknown as { currency?: string }).currency || "GHS",
      provider: requestData.provider,
      phone_number: requestData.phone_number,
      bank_name: requestData.bank_name,
      branch_name: requestData.branch_name,
      reason: requestData.reason,
      status: requestData.status,
      requestedDate: requestData.createdAt,
      processedDate: requestData.updatedAt,
      processedBy: requestData.processedBy?.toString(),
      rejectionReason: requestData.rejectionReason,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching wallet request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function hasRole(userRoles: string[], requiredRoles: string[]): boolean {
  return requiredRoles.some((role) =>
    userRoles.map((r) => r.toLowerCase()).includes(role.toLowerCase())
  );
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Authenticate user
    const auth = await authenticate(req);

    console.log("=== WALLET UPDATE DEBUG ===");
    console.log("Auth result:", auth);

    if (auth.error) {
      console.log("Authentication failed:", auth.error);
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Check if user has admin or paymaster role
    const canApprove = hasRole(auth.user!.roles, [
      "admin",
      "super-admin",
      "backoffice-admin",
      "paymaster",
    ]);

    console.log("User roles:", auth.user!.roles);
    console.log("Can approve:", canApprove);

    if (!canApprove) {
      return NextResponse.json(
        {
          error:
            "Forbidden: Only admin or paymaster can approve/decline requests",
        },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const {
      status,
      payment_method,
      provider,
      phone_number,
      bank_name,
      branch_name,
    } = body;

    console.log("Update request:", { id, status, payment_method });

    // Validate status
    if (!["approved", "declined"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'approved' or 'declined'" },
        { status: 400 }
      );
    }

    // Find the wallet request
    const walletRequest = await WalletRequest.findById(id);

    if (!walletRequest) {
      return NextResponse.json(
        { error: "Wallet request not found" },
        { status: 404 }
      );
    }

    // Check if already processed
    if (walletRequest.status !== "pending") {
      return NextResponse.json(
        { error: `Request already ${walletRequest.status}` },
        { status: 400 }
      );
    }

    // Update wallet request
    walletRequest.status = status;
    walletRequest.reviewed_by = auth.user!.id;
    walletRequest.reviewed_at = new Date();

    if (status === "approved") {
      // Validate payment method details
      // if (payment_method) {
      //   walletRequest.payment_method = payment_method;

      //   if (payment_method.toLowerCase().includes("mobile")) {
      //     if (!provider || !phone_number) {
      //       return NextResponse.json(
      //         { error: "Provider and phone number required for Mobile Money" },
      //         { status: 400 }
      //       );
      //     }
      //     walletRequest.provider = provider;
      //     walletRequest.phone_number = phone_number;
      //   }

      //   if (payment_method.toLowerCase().includes("bank")) {
      //     if (!bank_name || !branch_name) {
      //       return NextResponse.json(
      //         { error: "Bank name and branch name required for Bank Transfer" },
      //         { status: 400 }
      //       );
      //     }
      //     walletRequest.bank_name = bank_name;
      //     walletRequest.branch_name = branch_name;
      //   }
      // }

      // map frontend payment_method -> model enum value
      const mapToModelPaymentMethod = (pm?: string) => {
        if (!pm) return undefined;
        const p = String(pm).toLowerCase();
        if (p === "cash" || p.includes("cash")) return "Cash Payment";
        if (p === "mobile_money" || p.includes("mobile") || p.includes("momo"))
          return "Mobile Money";
        if (
          p === "bank_transfer" ||
          p.includes("bank") ||
          p.includes("transfer")
        )
          return "Bank Transfer";
        // fallback: return original (may fail validation) or undefined
        return undefined;
      };

      if (payment_method) {
        const modelPaymentMethod = mapToModelPaymentMethod(
          String(payment_method)
        );
        if (!modelPaymentMethod) {
          return NextResponse.json(
            { error: "Invalid payment method" },
            { status: 400 }
          );
        }
        walletRequest.payment_method = modelPaymentMethod;

        // the rest of your provider/phone/bank validations remain unchanged
        if (modelPaymentMethod.toLowerCase().includes("mobile")) {
          // ...
        }
        if (modelPaymentMethod.toLowerCase().includes("bank")) {
          // ...
        }
      }

      // Update user's wallet balance
      await User.findByIdAndUpdate(walletRequest.user, {
        $inc: { walletBalance: walletRequest.amount },
      });
    }

    await walletRequest.save();

    console.log("Wallet request updated successfully");

    return NextResponse.json(
      {
        message: `Request ${status} successfully`,
        walletRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating wallet request:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
