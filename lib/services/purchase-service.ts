import connectDB from "../db";
import PickupDetails from "../models/pickupDetails";
import Purchase, {
  IPurchase,
  MeasurementUnit,
  PurchaseStatus,
} from "../models/purchase";

export interface CreatePurchaseData {
  adminId: string;
  farmerId: string;
  // sellerId: string;
  grainType: string;
  quantity: number;
  measurementUnit: MeasurementUnit;
  pricePerUnit: number;
  charges?: number;
  paymentPhoneNumber: string;
  isThirdPartyPayment?: boolean;
  moveToStorehouse?: boolean;
  purchaseDate?: Date;
}

export class PurchaseService {
  // Create a new purchase
  static async createPurchase(data: CreatePurchaseData): Promise<IPurchase> {
    await connectDB();

    const totalCost = data.quantity * data.pricePerUnit + (data.charges || 0);

    const purchase = await Purchase.create({
      ...data,
      totalCost,
      status: "CONFIRMED",
    });

    // Create pickup details if not moving to storehouse
    if (!data.moveToStorehouse) {
      await PickupDetails.create({
        purchaseId: purchase._id,
        status: "PENDING",
      });
    }

    return purchase;
  }

  // Get purchase by ID
  static async getPurchaseById(id: string): Promise<IPurchase | null> {
    await connectDB();
    return await Purchase.findById(id)
      .populate("adminId")
      .populate("farmerId")
      // .populate("sellerId")
      .populate("grainType");
  }

  // Get all purchases
  static async getAllPurchases(): Promise<IPurchase[]> {
    await connectDB();
    return await Purchase.find()
      .populate("adminId")
      .populate("farmerId")
      .populate("sellerId")
      .populate("grainType")
      .sort({ purchaseDate: -1 });
  }

  // Get purchases by admin
  static async getPurchasesByAdmin(adminId: string): Promise<IPurchase[]> {
    await connectDB();
    return await Purchase.find({ adminId })
      .populate("farmerId")
      // .populate("sellerId")
      .populate("grainType")
      .sort({ purchaseDate: -1 });
  }

  // Get purchases by farmer
  static async getPurchasesByFarmer(farmerId: string): Promise<IPurchase[]> {
    await connectDB();
    return await Purchase.find({ farmerId })
      .populate("adminId")
      // .populate("sellerId")
      .populate("grainType")
      .sort({ purchaseDate: -1 });
  }

  // Get purchases by status
  static async getPurchasesByStatus(
    status: PurchaseStatus
  ): Promise<IPurchase[]> {
    await connectDB();
    return await Purchase.find({ status })
      .populate("adminId")
      .populate("farmerId")
      // .populate("sellerId")
      .populate("grainType")
      .sort({ purchaseDate: -1 });
  }

  // Update purchase status
  static async updatePurchaseStatus(
    id: string,
    status: PurchaseStatus
  ): Promise<IPurchase | null> {
    await connectDB();
    return await Purchase.findByIdAndUpdate(id, { status }, { new: true });
  }

  // Get purchase with pickup details
  static async getPurchaseWithPickup(id: string) {
    await connectDB();
    const purchase = await Purchase.findById(id)
      .populate("adminId")
      .populate("farmerId")
      // .populate("sellerId")
      .populate("grainType");

    if (!purchase) return null;

    const pickup = await PickupDetails.findOne({ purchaseId: id });

    return { purchase, pickup };
  }

  // Get purchases requiring pickup
  static async getPurchasesRequiringPickup(): Promise<IPurchase[]> {
    await connectDB();
    return await Purchase.find({ moveToStorehouse: false })
      .populate("farmerId")
      // .populate("sellerId")
      .populate("grainType")
      .sort({ purchaseDate: -1 });
  }
}
