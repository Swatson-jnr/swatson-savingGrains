import connectDB from '@/lib/db';
import warehouse from '@/lib/models/warehouse';
import { NextResponse } from 'next/server';

// GET all warehouses
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');

    const query = isActive !== null ? { isActive: isActive === 'true' } : {};

    const warehouses = await warehouse.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: warehouses,
      count: warehouses.length
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server Error";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// POST create new warehouse
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const { name, location, capacity } = body;

    if (!name || !location || !capacity) {
      return NextResponse.json({
        success: false,
        error: 'Name, location, and capacity are required'
      }, { status: 400 });
    }

    if (capacity <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Capacity must be greater than 0'
      }, { status: 400 });
    }

    const newWarehouse = await warehouse.create({
      name,
      location,
      capacity,
      currentStock: []
    });

    return NextResponse.json({
      success: true,
      data: newWarehouse,
      message: 'Warehouse created successfully'
    }, { status: 201 });

  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred";

    return NextResponse.json(
      { success: false, error: message },
      { status: (error as any)?.code === 11000 ? 400 : 500 }
    );
  }
}
