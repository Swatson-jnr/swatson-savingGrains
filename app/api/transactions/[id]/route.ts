import { NextResponse, type NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Transaction, { ITransaction } from "@/lib/models/transaction";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // MUST await in Next.js 15

    await connectDB();
    const mongoose = (await import("mongoose")).default;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid transaction id" },
        { status: 400 }
      );
    }

    const tx = await Transaction.findById<ITransaction>(id).lean();

    if (!tx) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
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
    });
  } catch (error) {
    const { id } = await context.params;
    console.error(`/api/transactions/${id} error:`, error);

    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}
