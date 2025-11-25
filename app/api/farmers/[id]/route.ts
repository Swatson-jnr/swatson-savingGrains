import { FarmerService } from "@/lib/services/farmer-service";
import { NextRequest, NextResponse } from "next/server";

// GET single farmer by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const farmer = await FarmerService.getFarmerById(params.id);

    if (!farmer) {
      return NextResponse.json(
        { success: false, error: "Farmer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      farmer,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch farmer" },
      { status: 500 }
    );
  }
}

// PUT update farmer
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, age, phoneNumber } = body;

    const farmer = await FarmerService.updateFarmer(params.id, {
      name,
      age,
      phoneNumber,
    });

    if (!farmer) {
      return NextResponse.json(
        { success: false, error: "Farmer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Farmer updated successfully",
      farmer,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update farmer" },
      { status: 500 }
    );
  }
}

// DELETE farmer
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await FarmerService.deleteFarmer(params.id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Farmer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Farmer deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete farmer" },
      { status: 500 }
    );
  }
}
