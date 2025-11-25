// ============================================
// PICKUP SERVICE (All Pickup Functions)
// File: src/services/pickupService.ts
// ============================================

import connectDB from "../db";
import PickupDetails, { IPickupDetails, PickupStatus } from "../models/pickupDetails";

// import PickupDetails, { IPickupDetails, PickupStatus } from '@/models/PickupDetails';
// import connectDB from '@/lib/mongodb';

export class PickupService {
  // Create pickup details
  static async createPickup(purchaseId: string): Promise<IPickupDetails> {
    await connectDB();
    
    const pickup = await PickupDetails.create({
      purchaseId,
      status: 'PENDING'
    });
    
    return pickup;
  }

  // Get pickup by ID
  static async getPickupById(id: string): Promise<IPickupDetails | null> {
    await connectDB();
    return await PickupDetails.findById(id).populate('purchaseId');
  }

  // Get pickup by purchase ID
  static async getPickupByPurchaseId(purchaseId: string): Promise<IPickupDetails | null> {
    await connectDB();
    return await PickupDetails.findOne({ purchaseId }).populate('purchaseId');
  }

  // Get all pickups
  static async getAllPickups(): Promise<IPickupDetails[]> {
    await connectDB();
    return await PickupDetails.find().populate('purchaseId').sort({ createdAt: -1 });
  }

  // Get pickups by status
  static async getPickupsByStatus(status: PickupStatus): Promise<IPickupDetails[]> {
    await connectDB();
    return await PickupDetails.find({ status }).populate('purchaseId').sort({ createdAt: -1 });
  }

  // Schedule pickup
  static async schedulePickup(
    id: string,
    scheduledDate: Date,
    notes?: string
  ): Promise<IPickupDetails | null> {
    await connectDB();
    return await PickupDetails.findByIdAndUpdate(
      id,
      { 
        scheduledDate,
        notes,
        status: 'SCHEDULED'
      },
      { new: true }
    );
  }

  // Update pickup status
  static async updatePickupStatus(
    id: string,
    status: PickupStatus,
    actualDate?: Date
  ): Promise<IPickupDetails | null> {
    await connectDB();
    
    const updateData: any = { status };
    if (actualDate) {
      updateData.actualDate = actualDate;
    }
    
    return await PickupDetails.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
  }

  // Complete pickup
  static async completePickup(id: string): Promise<IPickupDetails | null> {
    await connectDB();
    return await PickupDetails.findByIdAndUpdate(
      id,
      { 
        status: 'COMPLETED',
        actualDate: new Date()
      },
      { new: true }
    );
  }

  // Get pending pickups
  static async getPendingPickups(): Promise<IPickupDetails[]> {
    await connectDB();
    return await PickupDetails.find({ status: 'PENDING' })
      .populate('purchaseId')
      .sort({ createdAt: -1 });
  }
}
