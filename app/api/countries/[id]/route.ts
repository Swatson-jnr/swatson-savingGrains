import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Country from "@/lib/models/country";
import mongoose from "mongoose";
import { requireAdmin } from "@/lib/auth/api-auths";
// import { requireAdmin } from "@/lib/auth/apiAuth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check admin access first
  const authResult = await requireAdmin(req);
  if (authResult instanceof NextResponse) {
    return authResult; // Return error response
  }

  await connectDB();

  // Await params before accessing properties
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid country ID" }, { status: 400 });
  }

  const { name, flag } = await req.json();

  if (!name && !flag) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    const updated = await Country.findByIdAndUpdate(
      id,
      { name, flag },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check admin access first
  const authResult = await requireAdmin(req);
  if (authResult instanceof NextResponse) {
    return authResult; // Return error response
  }

  await connectDB();

  // Await params before accessing properties
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid country ID" }, { status: 400 });
  }

  try {
    const deleted = await Country.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Country deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}