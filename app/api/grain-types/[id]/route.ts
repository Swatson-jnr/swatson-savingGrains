import { NextRequest, NextResponse } from "next/server";
import { GrainTypeService } from "@/lib/services/grainType-service";
// GET single grain type by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const grainType = await GrainTypeService.getGrainTypeById(params.id);

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
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, description } = body;

    const grainType = await GrainTypeService.updateGrainType(params.id, {
      name,
      description,
    });

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
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await GrainTypeService.deleteGrainType(params.id);

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
