// ============================================
// GRAIN TYPE SERVICE (All Grain Type Functions)
// File: src/services/grainTypeService.ts
// ============================================

import connectDB from "../db";
import GrainType, { IGrainType } from "../models/grainType";

// import GrainType, { IGrainType } from '@/models/GrainType';
// import connectDB from '@/lib/mongodb';

export class GrainTypeService {
  // Create a new grain type
  static async createGrainType(data: {
    name: string;
    description?: string;
  }): Promise<IGrainType> {
    await connectDB();
    
    // Check if grain type already exists
    const existing = await GrainType.findOne({ name: data.name });
    if (existing) {
      throw new Error('Grain type already exists');
    }
    
    const grainType = await GrainType.create(data);
    return grainType;
  }

  // Get grain type by ID
  static async getGrainTypeById(id: string): Promise<IGrainType | null> {
    await connectDB();
    return await GrainType.findById(id);
  }

  // Get grain type by name
  static async getGrainTypeByName(name: string): Promise<IGrainType | null> {
    await connectDB();
    return await GrainType.findOne({ name });
  }

  // Get all grain types
  static async getAllGrainTypes(): Promise<IGrainType[]> {
    await connectDB();
    return await GrainType.find().sort({ name: 1 });
  }

  // Update grain type
  static async updateGrainType(
    id: string,
    data: Partial<{ name: string; description: string }>
  ): Promise<IGrainType | null> {
    await connectDB();
    
    // If updating name, check for duplicates
    if (data.name) {
      const existing = await GrainType.findOne({ 
        name: data.name,
        _id: { $ne: id }
      });
      if (existing) {
        throw new Error('Grain type name already exists');
      }
    }
    
    return await GrainType.findByIdAndUpdate(id, data, { new: true });
  }

  // Delete grain type
  static async deleteGrainType(id: string): Promise<boolean> {
    await connectDB();
    const result = await GrainType.findByIdAndDelete(id);
    return !!result;
  }
}