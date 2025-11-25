import { PickupService } from "@/lib/services/pickup-service";
import { NextRequest, NextResponse } from "next/server";

// GET single pickup by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const pickup = await PickupService.getPickupById(id);

    if (!pickup) {
      return NextResponse.json(
        { success: false, error: "Pickup not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      pickup,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch pickup" },
      { status: 500 }
    );
  }
}

// DELETE pickup
// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await params;

//   try {
//     const deleted = await PickupService.deletePickup(id);

//     if (!deleted) {
//       return NextResponse.json(
//         { success: false, error: "Pickup not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Pickup deleted successfully",
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, error: error.message || "Failed to delete pickup" },
//       { status: 500 }
//     );
//   }
// }
