import { FarmerService } from "@/lib/services/farmer-service";
import { NextRequest, NextResponse } from "next/server";

// GET all farmers
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    let farmers;
    if (search) {
      farmers = await FarmerService.searchFarmers(search);
    } else {
      farmers = await FarmerService.getAllFarmers();
    }

    return NextResponse.json({
      success: true,
      farmers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch farmers" },
      { status: 500 }
    );
  }
}

// POST create new farmer
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, age, phoneNumber, gender } = body;

    if (!name || !age || !phoneNumber || !gender) {
      return NextResponse.json(
        { success: false, error: "Name, age, and phone number are required" },
        { status: 400 }
      );
    }

    const farmer = await FarmerService.createFarmer({ name, age, phoneNumber, gender });

    return NextResponse.json(
      {
        success: true,
        message: "Farmer created successfully",
        farmer,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create farmer" },
      { status: 500 }
    );
  }
}
