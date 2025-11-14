import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Transaction, { ITransaction } from "@/lib/models/transaction";
// import Transaction, { ITransaction } from "@/lib/models/transaction";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();
    const mongoose = (await import("mongoose")).default;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid transaction id" },
        { status: 400 }
      );
    }

    const tx = await Transaction.findById<ITransaction>(id).lean();

    if (!tx) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const mapped = {
      id: String(tx._id),
      label: tx.label,
      date: tx.date,
      user: tx.user,
      amount: tx.amount,
      status: tx.status,
      currency: tx.currency,
      paymentType: tx.paymentType,
      counterparty: tx.counterparty,
      description: tx.description,
    };

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("/api/transactions/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}
