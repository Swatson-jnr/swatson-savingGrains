

import connectDB from '../db';
import Farmer, { IFarmer } from '../models/farmer';

export class FarmerService {
  // Create a new farmer
  static async createFarmer(data: {
    name: string;
    age: number;
    gender: string;
    phoneNumber: string;
  }): Promise<IFarmer> {
    await connectDB();
    
    // Check if phone number already exists
    const existing = await Farmer.findOne({ phoneNumber: data.phoneNumber });
    if (existing) {
      throw new Error('Phone number already registered');
    }
    
    const farmer = await Farmer.create(data);
    return farmer;
  }

  // Get farmer by ID
  static async getFarmerById(id: string): Promise<IFarmer | null> {
    await connectDB();
    return await Farmer.findById(id);
  }

  // Get farmer by phone number
  static async getFarmerByPhone(phoneNumber: string): Promise<IFarmer | null> {
    await connectDB();
    return await Farmer.findOne({ phoneNumber });
  }

  // Get all farmers
  static async getAllFarmers(): Promise<IFarmer[]> {
    await connectDB();
    return await Farmer.find().sort({ name: 1 });
  }

  // Update farmer details
  static async updateFarmer(
    id: string,
    data: Partial<{ name: string; age: number; phoneNumber: string; gender: string }>
  ): Promise<IFarmer | null> {
    await connectDB();
    
    // If updating phone number, check for duplicates
    if (data.phoneNumber) {
      const existing = await Farmer.findOne({ 
        phoneNumber: data.phoneNumber,
        _id: { $ne: id }
      });
      if (existing) {
        throw new Error('Phone number already registered');
      }
    }
    
    return await Farmer.findByIdAndUpdate(id, data, { new: true });
  }

  // Delete farmer
  static async deleteFarmer(id: string): Promise<boolean> {
    await connectDB();
    const result = await Farmer.findByIdAndDelete(id);
    return !!result;
  }

  // Search farmers by name
  static async searchFarmers(query: string): Promise<IFarmer[]> {
    await connectDB();
    return await Farmer.find({
      name: { $regex: query, $options: 'i' }
    }).sort({ name: 1 });
  }
}

