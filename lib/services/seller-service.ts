import connectDB from "../db";
import Seller, { ISeller } from "../models/seller";


export class SellerService {
  // Create a new seller
  static async createSeller(data: {
    name: string;
    phoneNumber: string;
    address?: string;
  }): Promise<ISeller> {
    await connectDB();

    // Check if phone number already exists
    const existing = await Seller.findOne({ phoneNumber: data.phoneNumber });
    if (existing) {
      throw new Error("Phone number already registered");
    }

    const seller = await Seller.create(data);
    return seller;
  }

  // Get seller by ID
  static async getSellerById(id: string): Promise<ISeller | null> {
    await connectDB();
    return await Seller.findById(id);
  }

  // Get seller by phone number
  static async getSellerByPhone(phoneNumber: string): Promise<ISeller | null> {
    await connectDB();
    return await Seller.findOne({ phoneNumber });
  }

  // Get all sellers
  static async getAllSellers(): Promise<ISeller[]> {
    await connectDB();
    return await Seller.find().sort({ name: 1 });
  }

  // Update seller details
  static async updateSeller(
    id: string,
    data: Partial<{ name: string; phoneNumber: string; address: string }>
  ): Promise<ISeller | null> {
    await connectDB();

    // If updating phone number, check for duplicates
    if (data.phoneNumber) {
      const existing = await Seller.findOne({
        phoneNumber: data.phoneNumber,
        _id: { $ne: id },
      });
      if (existing) {
        throw new Error("Phone number already registered");
      }
    }

    return await Seller.findByIdAndUpdate(id, data, { new: true });
  }

  // Delete seller
  static async deleteSeller(id: string): Promise<boolean> {
    await connectDB();
    const result = await Seller.findByIdAndDelete(id);
    return !!result;
  }

  // Search sellers by name
  static async searchSellers(query: string): Promise<ISeller[]> {
    await connectDB();
    return await Seller.find({
      name: { $regex: query, $options: "i" },
    }).sort({ name: 1 });
  }
}
