import { GrainTypeService } from "@/lib/services/grainType-service";
import { NextRequest, NextResponse } from "next/server";

// GET all grain types
export async function GET(req: NextRequest) {
  try {
    const grainTypes = await GrainTypeService.getAllGrainTypes();

    return NextResponse.json({
      success: true,
      grainTypes,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch grain types" },
      { status: 500 }
    );
  }
}

// POST create new grain type
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const grainType = await GrainTypeService.createGrainType({
      name,
      description,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Grain type created successfully",
        grainType,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create grain type" },
      { status: 500 }
    );
  }
}
