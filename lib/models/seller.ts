import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISeller extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  phoneNumber: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SellerSchema = new Schema<ISeller>(
  {
    name: {
      type: String,
      required: [true, "Seller name is required"],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "sellers",
  }
);

// Index for faster phone number lookups
SellerSchema.index({ phoneNumber: 1 });

const Seller: Model<ISeller> =
  mongoose.models.Seller || mongoose.model<ISeller>("Seller", SellerSchema);

export default Seller;
