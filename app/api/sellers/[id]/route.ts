import { NextRequest, NextResponse } from "next/server";
import { SellerService } from "@/lib/services/seller-service";


// GET single seller by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const seller = await SellerService.getSellerById(params.id);

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
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, phoneNumber, address } = body;

    const seller = await SellerService.updateSeller(params.id, {
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
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await SellerService.deleteSeller(params.id);

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
