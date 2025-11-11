import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Wallet from "@/lib/models/wallet";
import { authenticate } from "@/lib/middleware/authMiddleware";
import { ALLOWED_WALLET_TYPES } from "@/constants/walletTypes";

export const POST = async (req: NextRequest) => {
  try {
    const auth = await authenticate(req);
    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });

    if (!auth.user?.id) {
      return NextResponse.json(
        { error: "User not found in authentication result" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      name,
      type,
      currency = "GHS",
      balance = 0,
      metadata = {},
      system = false,
    } = body;

    if (!name || !type)
      return NextResponse.json(
        { error: "Missing required fields: name and type" },
        { status: 400 }
      );

    if (!ALLOWED_WALLET_TYPES.includes(type))
      return NextResponse.json(
        {
          error: `Invalid wallet type. Allowed values are: ${ALLOWED_WALLET_TYPES.join(
            ", "
          )}.`,
        },
        { status: 400 }
      );

    await connectDB();

    // Check if user already has a wallet of this type
    const existingWallet = await Wallet.findOne({
      user: auth.user.id,
      type,
    });

    if (existingWallet) {
      // If wallet exists, update its balance
      existingWallet.balance += balance;
      existingWallet.updatedAt = new Date();

      await existingWallet.save();

      return NextResponse.json(
        {
          message: `Wallet of type '${type}' updated successfully.`,
          wallet: existingWallet,
        },
        { status: 200 }
      );
    }

    // create a new wallet if not already existing
    const newWallet = await Wallet.create({
      name,
      type,
      currency,
      balance,
      metadata,
      system,
      user: auth.user.id,
    });

    return NextResponse.json(
      {
        message: "New wallet created successfully.",
        wallet: newWallet,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating or updating wallet:", error);
    return NextResponse.json(
      { error: "Failed to create or update wallet" },
      { status: 500 }
    );
  }
};

// export async function GET(req: NextRequest) {
//   try {
//     const auth = await authenticate(req);
//     if (auth.error)
//       return NextResponse.json({ error: auth.error }, { status: auth.status });

//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");

//     if (id) {
//       const wallet = await Wallet.findById(id).lean();
//       if (!wallet)
//         return NextResponse.json({ error: "Not found" }, { status: 404 });
//       return NextResponse.json(wallet, { status: 200 });
//     }

//     const wallets = await Wallet.find({}).lean();
//     return NextResponse.json(wallets, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching wallets:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch wallets" },
//       { status: 500 }
//     );
//   }
// }

export async function GET(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });

    if (!auth.user) {
      return NextResponse.json(
        { error: "User not found in authentication result" },
        { status: 401 }
      );
    }

    await connectDB();

    const userId = auth.user.id;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const wallet = await Wallet.findOne({ _id: id, user: userId }).lean();
      if (!wallet)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(wallet, { status: 200 });
    }

    const wallets = await Wallet.find({ user: userId }).lean();
    return NextResponse.json(wallets, { status: 200 });
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallets" },
      { status: 500 }
    );
  }
}

export const PUT = async (req: NextRequest) => {
  try {
    const auth = await authenticate(req);
    if (auth.error)
      return NextResponse.json({ error: auth.error }, { status: auth.status });

    await connectDB();

    const body = await req.json();
    const { id, name, balance, currency, metadata } = body;
    if (!id)
      return NextResponse.json({ error: "Missing wallet id" }, { status: 400 });

    const update: Record<string, unknown> = {};
    if (typeof name === "string") update.name = name;
    if (typeof balance === "number") update.balance = balance;
    if (metadata && typeof metadata === "object" && !Array.isArray(metadata))
      update.metadata = metadata;
    if (typeof metadata === "object") update.metadata = metadata;

    const wallet = await Wallet.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    ).lean();
    if (!wallet)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(wallet, { status: 200 });
  } catch (error) {
    console.error("Error updating wallet:", error);
    return NextResponse.json(
      { error: "Failed to update wallet" },
      { status: 500 }
    );
  }
};
