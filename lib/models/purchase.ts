import mongoose, { Schema, Document, Model } from "mongoose";

export type MeasurementUnit = "KG" | "BAG";
export type PurchaseStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export interface IPurchase extends Document {
  _id: mongoose.Types.ObjectId;
  adminId: mongoose.Types.ObjectId;
  farmerId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  grainType: string;

  quantity: number;
  measurementUnit: MeasurementUnit;
  pricePerUnit: number;
  totalCost: number;
  charges: number;

  paymentPhoneNumber: string;
  isThirdPartyPayment: boolean;

  moveToStorehouse: boolean;
  purchaseDate: Date;
  status: PurchaseStatus;

  createdAt: Date;
  updatedAt: Date;
}

const PurchaseSchema = new Schema<IPurchase>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "Admin ID is required"],
    },
    farmerId: {
      type: Schema.Types.ObjectId,
      ref: "Farmer",
      required: [true, "Farmer ID is required"],
    },
    // sellerId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Seller",
    //   required: [true, "Seller ID is required"],
    // },
    grainType: {
      type: String,
      ref: "GrainType",
      required: [true, "Grain type is required"],
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0.01, "Quantity must be greater than 0"],
    },
    measurementUnit: {
      type: String,
      enum: ["KG", "BAG"],
      required: [true, "Measurement unit is required"],
    },
    pricePerUnit: {
      type: Number,
      required: [true, "Price per unit is required"],
      min: [0, "Price must be positive"],
    },
    totalCost: {
      type: Number,
      required: [true, "Total cost is required"],
      min: [0, "Total cost must be positive"],
    },
    charges: {
      type: Number,
      default: 0,
      min: [0, "Charges must be positive"],
    },

    paymentPhoneNumber: {
      type: String,
      required: [true, "Payment phone number is required"],
      trim: true,
    },
    isThirdPartyPayment: {
      type: Boolean,
      default: false,
    },

    moveToStorehouse: {
      type: Boolean,
      default: false,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
    collection: "purchases",
  }
);

// Indexes for common queries
PurchaseSchema.index({ adminId: 1, purchaseDate: -1 });
PurchaseSchema.index({ farmerId: 1 });
PurchaseSchema.index({ status: 1 });

const Purchase: Model<IPurchase> =
  mongoose.models.Purchase ||
  mongoose.model<IPurchase>("Purchase", PurchaseSchema);

export default Purchase;
