import mongoose, { Schema, Document, Model } from "mongoose";

export type PickupStatus =
  | "PENDING"
  | "SCHEDULED"
  | "IN_TRANSIT"
  | "COMPLETED"
  | "CANCELLED";

export interface IPickupDetails extends Document {
  _id: mongoose.Types.ObjectId;
  purchaseId: mongoose.Types.ObjectId;
  scheduledDate?: Date;
  actualDate?: Date;
  status: PickupStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PickupDetailsSchema = new Schema<IPickupDetails>(
  {
    purchaseId: {
      type: Schema.Types.ObjectId,
      ref: "Purchase",
      required: [true, "Purchase ID is required"],
      unique: true,
    },
    scheduledDate: {
      type: Date,
    },
    actualDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["PENDING", "SCHEDULED", "IN_TRANSIT", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "pickupdetails",
  }
);

// Index for faster purchase lookups
PickupDetailsSchema.index({ purchaseId: 1 });

const PickupDetails: Model<IPickupDetails> =
  mongoose.models.PickupDetails ||
  mongoose.model<IPickupDetails>("PickupDetails", PickupDetailsSchema);

export default PickupDetails;
