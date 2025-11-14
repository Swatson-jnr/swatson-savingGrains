import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
// import Transaction, { ITransaction } from "@/lib/models/transaction";
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
