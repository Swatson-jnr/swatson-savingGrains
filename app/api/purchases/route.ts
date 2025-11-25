import { verifyToken } from "@/lib/auth";
import { PurchaseService } from "@/lib/services/purchase-service";
import { NextRequest, NextResponse } from "next/server";

// GET all purchases (with optional filters)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const adminId = searchParams.get("adminId");
    const farmerId = searchParams.get("farmerId");
    const status = searchParams.get("status");
    const requiresPickup = searchParams.get("requiresPickup");

    let purchases;

    if (adminId) {
      purchases = await PurchaseService.getPurchasesByAdmin(adminId);
    } else if (farmerId) {
      purchases = await PurchaseService.getPurchasesByFarmer(farmerId);
    } else if (status) {
      purchases = await PurchaseService.getPurchasesByStatus(status as any);
    } else if (requiresPickup === "true") {
      purchases = await PurchaseService.getPurchasesRequiringPickup();
    } else {
      purchases = await PurchaseService.getAllPurchases();
    }

    return NextResponse.json({
      success: true,
      purchases,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}

// POST create new purchase (direct - not through session flow)
export async function POST(req: NextRequest) {
  try {
    // Get token from Authorization header: "Bearer <token>"
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const adminId = decoded.id; 

    const body = await req.json();
    const {
      farmerId,
      // sellerId,
      grainType,
      quantity,
      measurementUnit,
      pricePerUnit,
      charges,
      paymentPhoneNumber,
      isThirdPartyPayment,
      moveToStorehouse,
      purchaseDate,
    } = body;

    if (
      !farmerId ||
      // !sellerId ||
      // !grainTypeId ||
      !quantity ||
      !measurementUnit ||
      !pricePerUnit ||
      !paymentPhoneNumber
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const purchase = await PurchaseService.createPurchase({
      adminId,
      farmerId,
      // sellerId,
      grainType,
      quantity,
      measurementUnit,
      pricePerUnit,
      charges,
      paymentPhoneNumber,
      isThirdPartyPayment,
      moveToStorehouse,
      purchaseDate,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Purchase created successfully",
        purchase,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create purchase" },
      { status: 500 }
    );
  }
}
