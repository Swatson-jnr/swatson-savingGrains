import { NextRequest, NextResponse } from "next/server";
import { SellerService } from "@/lib/services/seller-service";

// GET single seller by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const seller = await SellerService.getSellerById(id);

    if (!seller) {
      return NextResponse.json(
        { success: false, error: "Seller not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      seller,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch seller" },
      { status: 500 }
    );
  }
}

// PUT update seller
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await req.json();
    const { name, phoneNumber, address } = body;

    const seller = await SellerService.updateSeller(id, {
      name,
      phoneNumber,
      address,
    });

    if (!seller) {
      return NextResponse.json(
        { success: false, error: "Seller not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Seller updated successfully",
      seller,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update seller" },
      { status: 500 }
    );
  }
}

// DELETE seller
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const deleted = await SellerService.deleteSeller(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Seller not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Seller deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete seller" },
      { status: 500 }
    );
  }
}
