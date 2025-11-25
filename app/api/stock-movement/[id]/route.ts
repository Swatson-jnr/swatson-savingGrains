import connectDB from "@/lib/db";
import stockMovement from "@/lib/models/stock-movement";
import warehouse from "@/lib/models/warehouse";
import { NextResponse } from "next/server";

// ============ GET SINGLE MOVEMENT ============
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connectDB();

    const movement = await stockMovement
      .findById(id)
      .populate("sourceWarehouse", "name location")
      .populate("destinationWarehouse", "name location")
      .populate("authorizedBy", "name email");

    if (!movement) {
      return NextResponse.json(
        { success: false, error: "Stock movement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: movement });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// ============ UPDATE MOVEMENT (ONLY IF PENDING) ============
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connectDB();
    const body = await request.json();

    const movement = await stockMovement.findById(id);

    if (!movement) {
      return NextResponse.json(
        { success: false, error: "Stock movement not found" },
        { status: 404 }
      );
    }

    if (movement.status !== "pending") {
      return NextResponse.json(
        { success: false, error: "Only pending movements can be updated" },
        { status: 400 }
      );
    }

    // Update Quantity
    if (body.quantity !== undefined) {
      if (body.quantity <= 0) {
        return NextResponse.json(
          { success: false, error: "Quantity must be greater than 0" },
          { status: 400 }
        );
      }

      const source = await warehouse.findById(movement.sourceWarehouse);
      if (!source) {
        return NextResponse.json(
          { success: false, error: "Source warehouse not found" },
          { status: 404 }
        );
      }

      const stockItem = source.currentStock.find(
        (item: any) =>
          item.grainType === movement.grainType &&
          item.measurementType === movement.measurementType
      );

      if (!stockItem || stockItem.quantity < body.quantity) {
        return NextResponse.json(
          { success: false, error: "Insufficient stock for updated quantity" },
          { status: 400 }
        );
      }

      movement.quantity = body.quantity;
      movement.totalValue = movement.quantity * movement.pricePerUnit;
    }

    // Update Price
    if (body.pricePerUnit !== undefined) {
      if (body.pricePerUnit <= 0) {
        return NextResponse.json(
          { success: false, error: "Price per unit must be greater than 0" },
          { status: 400 }
        );
      }
      movement.pricePerUnit = body.pricePerUnit;
      movement.totalValue = movement.quantity * movement.pricePerUnit;
    }

    // Update Notes
    if (body.notes !== undefined) {
      movement.notes = body.notes;
    }

    await movement.save();

    await movement.populate([
      { path: "sourceWarehouse", select: "name location" },
      { path: "destinationWarehouse", select: "name location" },
      { path: "authorizedBy", select: "name email" },
    ]);

    return NextResponse.json({
      success: true,
      data: movement,
      message: "Stock movement updated successfully",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// ============ CANCEL MOVEMENT ============
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connectDB();

    const movement = await stockMovement.findById(id);

    if (!movement) {
      return NextResponse.json(
        { success: false, error: "Stock movement not found" },
        { status: 404 }
      );
    }

    if (movement.status !== "pending") {
      return NextResponse.json(
        { success: false, error: "Only pending movements can be cancelled" },
        { status: 400 }
      );
    }

    movement.status = "cancelled";
    await movement.save();

    return NextResponse.json({
      success: true,
      message: "Stock movement cancelled successfully",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
