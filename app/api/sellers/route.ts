import { SellerService } from "@/lib/services/seller-service";
import { NextRequest, NextResponse } from "next/server";

// GET all sellers
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    let sellers;
    if (search) {
      sellers = await SellerService.searchSellers(search);
    } else {
      sellers = await SellerService.getAllSellers();
    }

    return NextResponse.json({
      success: true,
      sellers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch sellers" },
      { status: 500 }
    );
  }
}

// POST create new seller
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phoneNumber, address } = body;

    if (!name || !phoneNumber) {
      return NextResponse.json(
        { success: false, error: "Name and phone number are required" },
        { status: 400 }
      );
    }

    const seller = await SellerService.createSeller({
      name,
      phoneNumber,
      address,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Seller created successfully",
        seller,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create seller" },
      { status: 500 }
    );
  }
}
