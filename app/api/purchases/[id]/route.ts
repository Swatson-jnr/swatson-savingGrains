import { NextRequest, NextResponse } from "next/server";
import { PurchaseService } from "@/lib/services/purchase-service";

// GET single purchase by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const result = await PurchaseService.getPurchaseWithPickup(id);

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Purchase not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      purchase: result.purchase,
      pickup: result.pickup,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch purchase" },
      { status: 500 }
    );
  }
}

// PUT update purchase status
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status is required" },
        { status: 400 }
      );
    }

    const purchase = await PurchaseService.updatePurchaseStatus(id, status);

    if (!purchase) {
      return NextResponse.json(
        { success: false, error: "Purchase not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Purchase status updated successfully",
      purchase,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update purchase" },
      { status: 500 }
    );
  }
}
