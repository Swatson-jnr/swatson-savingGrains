import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Country from "@/lib/models/country";
import { requireAdmin } from "@/lib/auth/api-auths";
// import { requireAdmin } from "@/lib/auth/apiAuth";

export async function POST(req: NextRequest) {
  // Check admin access first
  const authResult = await requireAdmin(req);
  if (authResult instanceof NextResponse) {
    return authResult; // Return 401 or 403 error
  }

  await connectDB();

  const { name, flag } = await req.json();

  if (!name || !flag) {
    return NextResponse.json(
      { error: "Name and flag are required" },
      { status: 400 }
    );
  }

  try {
    const country = await Country.create({ name, flag });
    return NextResponse.json(country, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  // GET is public - anyone can view countries
  await connectDB();
  const countries = await Country.find().sort({ name: 1 });
  return NextResponse.json(countries);
}