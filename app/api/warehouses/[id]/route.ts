import connectDB from "@/lib/db";
import Warehouse from "@/lib/models/warehouse";
import { NextResponse } from "next/server";

// GET single warehouse
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const warehouse = await Warehouse.findById(params.id);

    if (!warehouse) {
      return NextResponse.json(
        { success: false, error: "Warehouse not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: warehouse });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// UPDATE warehouse
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();

    const warehouse = await Warehouse.findById(params.id);

    if (!warehouse) {
      return NextResponse.json(
        { success: false, error: "Warehouse not found" },
        { status: 404 }
      );
    }

    // Update fields
    if (body.name) warehouse.name = body.name;
    if (body.location) warehouse.location = body.location;

    if (body.capacity !== undefined) {
      if (body.capacity <= 0) {
        return NextResponse.json(
          { success: false, error: "Capacity must be greater than 0" },
          { status: 400 }
        );
      }
      warehouse.capacity = body.capacity;
    }

    if (body.isActive !== undefined) warehouse.isActive = body.isActive;

    await warehouse.save();

    return NextResponse.json({
      success: true,
      data: warehouse,
      message: "Warehouse updated successfully",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// DELETE warehouse (soft delete)
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const warehouse = await Warehouse.findById(params.id);

    if (!warehouse) {
      return NextResponse.json(
        { success: false, error: "Warehouse not found" },
        { status: 404 }
      );
    }

    // Cannot delete if stock exists
    if (warehouse.currentStock && warehouse.currentStock.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Cannot delete warehouse with existing stock. Transfer stock first.",
        },
        { status: 400 }
      );
    }

    // Soft delete
    warehouse.isActive = false;
    await warehouse.save();

    return NextResponse.json({
      success: true,
      message: "Warehouse deleted successfully",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
