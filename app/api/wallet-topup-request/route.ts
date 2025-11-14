import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { authenticate } from "@/lib/middleware/authMiddleware";
import User from "@/lib/models/user";
import { adminRoles } from "@/constants/roles";
import { processWalletApproval } from "@/lib/services/wallet.transactions";
import logger from "@/lib/utils/logger";
import {
  validateRequestBody,
  validateQueryParams,
  validateResponseData,
} from "@/lib/middleware/validateSchema";

import { WalletRequestStatus } from "@/lib/models/walletRequest.enums";
import {
  CreateWalletRequestSchema,
  ListWalletRequestsQuerySchema,
} from "@/lib/schemas/wallet-request-schemas";
import {
  ListWalletRequestsResponseSchema,
  SingleWalletRequestResponseSchema,
} from "@/lib/schemas/wallet-response-schemas";
import WalletRequest from "@/lib/models/walletRequest";

/**
 * @swagger
 * /api/wallet-request:
 *   post:
 *     summary: Create a wallet funding request
 *     description: |
 *       Creates a new request to add funds to the user's wallet.
 *       - Regular users: Creates a request with status "pending" (no wallet deduction)
 *       - Admin/Paymaster: Auto-approves and credits wallet immediately (status "approved")
 *     tags:
 *       - Wallet Requests
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 1
 *                 description: Amount to be added to wallet (must be positive)
 *                 example: 100.50
 *               reason:
 *                 type: string
 *                 description: Optional reason for the wallet funding request
 *                 example: "Monthly savings deposit"
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Wallet request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 walletRequest:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     user:
 *                       type: string
 *                       description: User ID who created the request
 *                       example: "507f1f77bcf86cd799439012"
 *                     amount:
 *                       type: number
 *                       example: 100.50
 *                     payment_method:
 *                       type: string
 *                       nullable: true
 *                       description: Payment method (null at creation, set during approval)
 *                       example: null
 *                     reason:
 *                       type: string
 *                       example: "Monthly savings deposit"
 *                     status:
 *                       type: string
 *                       enum: ["pending", "approved", "declined", "successful"]
 *                       description: |
 *                         - pending: Regular user request awaiting approval
 *                         - approved: Admin/paymaster auto-approved or manually approved
 *                       example: "pending"
 *                     reviewed_by:
 *                       type: string
 *                       nullable: true
 *                       description: User ID who approved (set for admin/paymaster auto-approval)
 *                       example: null
 *                     reviewed_at:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       description: Timestamp of approval (set for admin/paymaster auto-approval)
 *                       example: null
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00.000Z"
 *       400:
 *         description: Bad request - invalid input or insufficient funds
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Amount must be a positive number"
 *       401:
 *         description: Unauthorized - invalid or missing JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to create wallet request"
 */
// eexport const POST = async (req: NextRequest) => {
//   try {
//     // Try authentication first
//     const auth = await authenticate(req);
//     if (auth.error)
//       return NextResponse.json({ error: auth.error }, { status: auth.status });

//     // Add null check for TypeScript
//     if (!auth.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const user = auth.user;

//     // Validate request body with Zod schema
//     const validation = await validateRequestBody(
//       req,
//       CreateWalletRequestSchema
//     );
//     if (!validation.success) {
//       return validation.response;
//     }

//     const { amount, reason } = validation.data;

//     // Try to connect to MongoDB
//     try {
//       await connectDB();
//     } catch (dbError) {
//       logger.error("Database connection failed", {
//         error: dbError instanceof Error ? dbError.message : String(dbError),
//         stack: dbError instanceof Error ? dbError.stack : undefined,
//       });

//       return NextResponse.json(
//         { error: "Service temporarily unavailable" },
//         { status: 503 }
//       );
//     }

//     // Determine if user is admin or paymaster
//     const fullUser = await User.findById(user.id).select("roles");
//     if (!fullUser) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }
//     const roles: string[] = Array.isArray(fullUser.roles) ? fullUser.roles : [];
//     const isPrivileged = roles.some(
//       (r) => adminRoles.includes(r) || r === "paymaster"
//     );

//     // Create the wallet request
//     const walletRequest = await WalletRequest.create({
//       user: user.id,
//       amount,
//       payment_method: null,
//       reason: reason || undefined,
//       status: WalletRequestStatus.PENDING,
//       reviewed_by: undefined,
//       reviewed_at: undefined,
//     });

//     // If privileged user, attempt auto-approval with wallet transaction
//     if (isPrivileged) {
//       const approvalResult = await processWalletApproval(
//         walletRequest._id,
//         user.id,
//         amount,
//         user.id
//       );

//       if (!approvalResult.success) {
//         // Convert to plain object before returning
//         const plainRequest = walletRequest.toObject();

//         logger.warn("Auto-approval failed for privileged user", {
//           userId: user.id,
//           requestId: walletRequest._id.toString(),
//           amount,
//           error: approvalResult.error,
//         });

//         return NextResponse.json(
//           {
//             walletRequest: plainRequest,
//             note:
//               "Request created in pending state. Auto-approval failed: " +
//               approvalResult.error,
//           },
//           { status: 201 }
//         );
//       }

//       logger.info("Wallet request auto-approved for privileged user", {
//         userId: user.id,
//         requestId: walletRequest._id.toString(),
//         amount,
//       });

//       // Fetch the updated request with .lean() to get plain object
//       const approvedRequest = await WalletRequest.findById(
//         walletRequest._id
//       ).lean();

//       if (!approvedRequest) {
//         return NextResponse.json(
//           { error: "Failed to fetch approved request" },
//           { status: 500 }
//         );
//       }

//       // Validate response data
//       const responseValidation = validateResponseData(
//         {
//           walletRequest: approvedRequest,
//           note: "Automatically approved for privileged user",
//         },
//         SingleWalletRequestResponseSchema,
//         { endpoint: "/api/wallet-topup-request", method: "POST" }
//       );
//       if (!responseValidation.success) return responseValidation.response;

//       return NextResponse.json(responseValidation.data, { status: 201 });
//     }

//     // Regular user: return pending request
//     logger.info("Wallet request created", {
//       userId: user.id,
//       requestId: walletRequest._id.toString(),
//       amount,
//       status: "pending",
//     });

//     // Convert to plain object
//     const plainRequest = walletRequest.toObject();

//     // Validate response data
//     const responseValidation = validateResponseData(
//       { walletRequest: plainRequest },
//       SingleWalletRequestResponseSchema,
//       { endpoint: "/api/wallet-topup-request", method: "POST" }
//     );
//     if (!responseValidation.success) return responseValidation.response;

//     return NextResponse.json(responseValidation.data, { status: 201 });
//   } catch (error) {
//     logger.error("Error creating wallet request", {
//       error: error instanceof Error ? error.message : String(error),
//       stack: error instanceof Error ? error.stack : undefined,
//     });
//     return NextResponse.json(
//       { error: "Failed to create wallet request" },
//       { status: 500 }
//     );
//   }

// the old one where it just goes and sit it
export const POST = async (req: NextRequest) => {
  try {
    // Try authentication first
    const auth = await authenticate(req);
    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });

    // Add null check for TypeScript
    if (!auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = auth.user;

    // Validate request body with Zod schema
    const validation = await validateRequestBody(
      req,
      CreateWalletRequestSchema
    );
    if (!validation.success) {
      return validation.response;
    }

    const { amount, payment_method, reason } = validation.data;

    // Try to connect to MongoDB
    try {
      await connectDB();
    } catch (dbError) {
      logger.error("Database connection failed", {
        error: dbError instanceof Error ? dbError.message : String(dbError),
        stack: dbError instanceof Error ? dbError.stack : undefined,
      });

      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }

    // Determine if user is admin or paymaster
    const fullUser = await User.findById(user.id).select("roles");
    if (!fullUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const roles: string[] = Array.isArray(fullUser.roles) ? fullUser.roles : [];
    // Treat explicit "admin" and any role in adminRoles as privileged, plus "paymaster"
    const isPrivileged = roles.some(
      (r) => adminRoles.includes(r) || r === "admin" || r === "paymaster"
    );

    // Create the wallet request with status based on user role
    const walletRequest = await WalletRequest.create({
      user: user.id,
      amount,
      payment_method: payment_method || null,
      reason: reason || undefined,
      status: isPrivileged
        ? WalletRequestStatus.APPROVED
        : WalletRequestStatus.PENDING,
      reviewed_by: isPrivileged ? user.id : undefined,
      reviewed_at: isPrivileged ? new Date() : undefined,
    });

    // If privileged user, attempt auto-approval with wallet transaction
    if (isPrivileged) {
      const approvalResult = await processWalletApproval(
        walletRequest._id,
        user.id,
        amount,
        user.id
      );

      if (!approvalResult.success) {
        // Convert to plain object before returning
        const plainRequest = walletRequest.toObject();

        logger.warn("Auto-approval failed for privileged user", {
          userId: user.id,
          requestId: walletRequest._id.toString(),
          amount,
          error: approvalResult.error,
        });

        return NextResponse.json(
          {
            walletRequest: plainRequest,
            note:
              "Request created in pending state. Auto-approval failed: " +
              approvalResult.error,
          },
          { status: 201 }
        );
      }

      logger.info("Wallet request auto-approved for privileged user", {
        userId: user.id,
        requestId: walletRequest._id.toString(),
        amount,
      });

      // Fetch the updated request with .lean() to get plain object
      const approvedRequest = await WalletRequest.findById(
        walletRequest._id
      ).lean();

      if (!approvedRequest) {
        return NextResponse.json(
          { error: "Failed to fetch approved request" },
          { status: 500 }
        );
      }

      // Validate response data
      const responseValidation = validateResponseData(
        {
          walletRequest: approvedRequest,
          note: "Automatically approved for privileged user",
        },
        SingleWalletRequestResponseSchema,
        { endpoint: "/api/wallet-topup-request", method: "POST" }
      );
      if (!responseValidation.success) return responseValidation.response;

      return NextResponse.json(responseValidation.data, { status: 201 });
    }

    // Regular user: return pending request
    logger.info("Wallet request created", {
      userId: user.id,
      requestId: walletRequest._id.toString(),
      amount,
      status: "pending",
    });

    // Convert to plain object
    const plainRequest = walletRequest.toObject();

    // Validate response data
    const responseValidation = validateResponseData(
      { walletRequest: plainRequest },
      SingleWalletRequestResponseSchema,
      { endpoint: "/api/wallet-topup-request", method: "POST" }
    );
    if (!responseValidation.success) return responseValidation.response;

    return NextResponse.json(responseValidation.data, { status: 201 });
  } catch (error) {
    logger.error("Error creating wallet request", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to create wallet request" },
      { status: 500 }
    );
  }
};
/**
 * @swagger
 * /api/wallet-request:
 *   get:
 *     summary: Get wallet funding requests
 *     description: Retrieves wallet funding requests for the authenticated user
 *     tags:
 *       - Wallet Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of requests to return
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: ["createdAt", "requestedDate", "amount"]
 *           default: "createdAt"
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: ["asc", "desc"]
 *           default: "desc"
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Successfully retrieved wallet requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique identifier for the request
 *                   user:
 *                     type: string
 *                     description: User ID who made the request
 *                   amount:
 *                     type: number
 *                     description: Requested amount
 *                   payment_method:
 *                     type: string
 *                     description: Payment method used
 *                   status:
 *                     type: string
 *                     description: Current status of the request
 *                   requestedDate:
 *                     type: string
 *                     format: date-time
 *                     description: Date when request was made
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Record creation timestamp
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       500:
 *         description: Internal server error
 */
export async function GET(request: NextRequest) {
  try {
    console.log("Starting wallet-topup-request GET handler");

    // Connect to DB
    await connectDB();

    // Authenticate
    const authResult = await authenticate(request);
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }
    const user = authResult.user;
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Validate query params
    const queryValidation = await validateQueryParams(
      request,
      ListWalletRequestsQuerySchema
    );
    if (!queryValidation.success) return queryValidation.response;

    // Destructure GET query params (these are provided by the schema)
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      status: statusFilter,
      paymentMethod: paymentMethodFilter,
      userType: userFilter,
      fromDate: fromDateFilter,
      toDate: toDateFilter,
    } = queryValidation.data as any;

    const skip = (page - 1) * limit;

    // Fetch full user to check roles
    const fullUser = await User.findById(user.id).lean();
    if (!fullUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userRoles: string[] = (fullUser as any).roles || [];
    const isAdmin = userRoles.some(
      (r) => adminRoles.includes(r) || r === "admin"
    );
    const isPaymaster = userRoles.includes("paymaster");
    const canSeeAllRequests = isAdmin || isPaymaster;

    // Build filter
    const filter: Record<string, any> = {};
    if (!canSeeAllRequests) filter.user = user.id;
    else if (userFilter === "myself") filter.user = user.id;
    else if (userFilter === "field-agents") {
      const fieldAgents = await User.find({ roles: "field-agent" })
        .select("_id")
        .lean();
      const fieldAgentIds = fieldAgents.map((a) => String(a._id));
      filter.user = { $in: fieldAgentIds };
    }

    if (statusFilter) filter.status = statusFilter;
    if (paymentMethodFilter)
      filter.payment_method = { $regex: new RegExp(paymentMethodFilter, "i") };
    if (fromDateFilter || toDateFilter) {
      const createdAt: Record<string, Date> = {};
      if (fromDateFilter) createdAt.$gte = new Date(fromDateFilter);
      if (toDateFilter) createdAt.$lte = new Date(toDateFilter);
      filter.createdAt = createdAt;
    }

    // Sort
    const validSortFields = ["createdAt", "amount", "status", "payment_method"];
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sort: Record<string, 1 | -1> = {
      [safeSortBy]: sortOrder === "asc" ? 1 : -1,
    };

    // Query
    const totalCount = await WalletRequest.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    const walletRequests = await WalletRequest.find(filter)
      .populate("user", "first_name last_name")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Transform
    const transformedRequests = walletRequests.map((r) => {
      const userInfo = r.user as any | null;
      const requesterName =
        userInfo && userInfo.first_name && userInfo.last_name
          ? `${userInfo.first_name} ${userInfo.last_name}`
          : "Unknown User";

      const pm = (r.payment_method || "").toLowerCase();
      let normalizedPaymentType:
        | "cash"
        | "mobile_money"
        | "bank_transfer"
        | null = null;
      if (!pm) normalizedPaymentType = null;
      else if (pm.includes("cash")) normalizedPaymentType = "cash";
      else if (pm.includes("mobile") || pm.includes("momo"))
        normalizedPaymentType = "mobile_money";
      else if (pm.includes("bank") || pm.includes("transfer"))
        normalizedPaymentType = "bank_transfer";

      const userId = userInfo?._id
        ? String(userInfo._id)
        : String(r.user || "");

      return {
        id: String(r._id),
        label: "Wallet Top-up",
        requestedDate: r.createdAt
          ? new Date(r.createdAt).toISOString()
          : new Date().toISOString(),
        user: userId,
        requesterName,
        amount: r.amount,
        status: r.status || "Pending",
        currency: "GHS",
        paymentType: normalizedPaymentType,
        reason: r.reason || undefined,
        approvedDate: r.reviewed_at
          ? new Date(r.reviewed_at).toISOString()
          : undefined,
      };
    });

    const responseData = {
      data: transformedRequests,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    const responseValidation = validateResponseData(
      responseData,
      ListWalletRequestsResponseSchema,
      { endpoint: "/api/wallet-topup-request", method: "GET" }
    );
    if (!responseValidation.success) return responseValidation.response;

    return NextResponse.json(responseValidation.data, { status: 200 });
  } catch (error) {
    logger?.error?.("Error fetching wallet requests", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to fetch wallet requests" },
      { status: 500 }
    );
  }
}
