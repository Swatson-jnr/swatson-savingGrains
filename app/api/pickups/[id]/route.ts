
import { PickupService } from '@/lib/services/pickup-service';
import { NextRequest, NextResponse } from 'next/server';

// GET single pickup by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pickup = await PickupService.getPickupById(params.id);

    if (!pickup) {
      return NextResponse.json(
        { success: false, error: 'Pickup not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      pickup
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch pickup' },
      { status: 500 }
    );
  }
}

// PUT update pickup (schedule or update status)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { scheduledDate, status, notes, actualDate } = body;

    let pickup;

    if (scheduledDate) {
      pickup = await PickupService.schedulePickup(params.id, new Date(scheduledDate), notes);
    } else if (status) {
      pickup = await PickupService.updatePickupStatus(
        params.id, 
        status, 
        actualDate ? new Date(actualDate) : undefined
      );
    } else {
      return NextResponse.json(
        { success: false, error: 'Either scheduledDate or status is required' },
        { status: 400 }
      );
    }

    if (!pickup) {
      return NextResponse.json(
        { success: false, error: 'Pickup not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Pickup updated successfully',
      pickup
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update pickup' },
      { status: 500 }
    );
  }
}
