import { NextRequest, NextResponse } from "next/server";
import { GrainTypeService } from "@/lib/services/grainType-service";

// GET single grain type by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const grainType = await GrainTypeService.getGrainTypeById(id);

    if (!grainType) {
      return NextResponse.json(
        { success: false, error: "Grain type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      grainType,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch grain type" },
      { status: 500 }
    );
  }
}

// PUT update grain type
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await req.json();
    const grainType = await GrainTypeService.updateGrainType(id, body);

    if (!grainType) {
      return NextResponse.json(
        { success: false, error: "Grain type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Grain type updated successfully",
      grainType,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update grain type" },
      { status: 500 }
    );
  }
}

// DELETE grain type
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const deleted = await GrainTypeService.deleteGrainType(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Grain type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Grain type deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete grain type" },
      { status: 500 }
    );
  }
}
