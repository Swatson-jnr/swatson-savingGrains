import mongoose, { Schema, Document, models } from "mongoose";
import { IUser } from "@/lib/models/user";

// Interface for StockMovement document
export interface IStockMovement extends Document {
  sourceWarehouse: mongoose.Types.ObjectId;
  destinationWarehouse: mongoose.Types.ObjectId;
  grainType: string;
  measurementType: "kg" | "bags";
  quantity: number;
  pricePerUnit: number;
  totalValue: number;
  status: "pending" | "approved" | "cancelled";
  authorizedBy: IUser | mongoose.Types.ObjectId; // <-- use IUser here
  notes?: string;
  movementDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose schema
const stockMovementSchema = new Schema<IStockMovement>(
  {
    sourceWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: [true, "Source warehouse is required"],
    },
    destinationWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: [true, "Destination warehouse is required"],
    },
    grainType: { type: String, required: [true, "Grain type is required"] },
    measurementType: {
      type: String,
      enum: ["kg", "bags"],
      required: [true, "Measurement type is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    pricePerUnit: {
      type: Number,
      required: [true, "Price per unit is required"],
      min: [0, "Price per unit cannot be negative"],
    },
    totalValue: {
      type: Number,
      required: true,
      min: [0, "Total value cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
    authorizedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Uses your existing User model
      required: [true, "AuthorizedBy (user) is required"],
    },
    notes: { type: String, default: "" },
    movementDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Avoid recompiling model in dev
const StockMovement =
  models.StockMovement ||
  mongoose.model<IStockMovement>("StockMovement", stockMovementSchema);

export default StockMovement;
