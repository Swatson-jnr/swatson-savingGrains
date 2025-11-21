import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import type { FilterQuery } from "mongoose";
import Transaction, { ITransaction } from "@/lib/models/transaction";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const limit = Math.max(1, Number(url.searchParams.get("limit") || "10"));

    const type = url.searchParams.get("type") || undefined;
    const user = url.searchParams.get("user") || undefined;
    const fromDate = url.searchParams.get("fromDate") || undefined;
    const toDate = url.searchParams.get("toDate") || undefined;
    const search = url.searchParams.get("search") || undefined;

    await connectDB();

    const query: FilterQuery<ITransaction> = {};
    if (type) query.paymentType = { $regex: type, $options: "i" };
    if (user) query.user = { $regex: user, $options: "i" };
    if (search)
      query.$or = [
        { label: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = new Date(fromDate);
      if (toDate) query.date.$lte = new Date(toDate);
    }

    const total = await Transaction.countDocuments(query);
    // const items = (await Transaction.find(query)
    //   .sort({ date: -1 })
    //   .skip((page - 1) * limit)
    //   .limit(limit)
    //   .lean()) as Array<ITransaction & { _id?: unknown }>

    const items = await Transaction.find<ITransaction>(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const mapped = items.map((it) => ({
      id: String(it._id),
      label: it.label,
      date: it.date,
      user: it.user,
      amount: it.amount,
      status: it.status,
      currency: it.currency,
      paymentType: it.paymentType,
      counterparty: it.counterparty,
      description: it.description,
    }));

    return NextResponse.json({ limit, page, total, items: mapped });
  } catch (error) {
    console.error("/api/transactions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}


// import { NextRequest, NextResponse } from "next/server"
// import mongoose from "mongoose"
// import Transaction, { ITransaction } from "@/models/Transaction"


export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await connectDB()

    // Parse request body
    const body = await req.json()

    // Validate required fields
    const { label, user, amount, currency } = body

    if (!label || !user || amount === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: label, user, and amount are required" },
        { status: 400 }
      )
    }

    // Validate amount is a number
    if (typeof amount !== "number" || isNaN(amount)) {
      return NextResponse.json(
        { error: "Amount must be a valid number" },
        { status: 400 }
      )
    }

    // Validate status if provided
    if (body.status && !["success", "failed", "pending"].includes(body.status)) {
      return NextResponse.json(
        { error: "Status must be one of: success, failed, pending" },
        { status: 400 }
      )
    }

    // Create transaction data object
    const transactionData: Partial<ITransaction> = {
      label,
      user,
      amount,
      currency: currency || "GHS",
      status: body.status || "success",
      ...(body.date && { date: new Date(body.date) }),
      ...(body.paymentType && { paymentType: body.paymentType }),
      ...(body.counterparty && { counterparty: body.counterparty }),
      ...(body.description && { description: body.description }),
      ...(body.metadata && { metadata: body.metadata }),
    }

    // Create new transaction
    const transaction = await Transaction.create(transactionData)

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Transaction created successfully",
        data: transaction,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Transaction creation error:", error)

    // Handle mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      )
    }

    // Handle duplicate key errors
    if ((error as any).code === 11000) {
      return NextResponse.json(
        { error: "Duplicate transaction" },
        { status: 409 }
      )
    }

    // Generic error response
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}